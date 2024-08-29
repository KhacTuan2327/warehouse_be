const Device = require('../models/Device');
const Warehouse = require('../models/Warehouse');

// Hàm để lấy danh sách thiết bị với thông tin yêu cầu
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      attributes: [
        'device_id',
        'type',
        'location',
        'status',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['name'], // Lấy tên kho
        },
      ],
    });

    // Xử lý dữ liệu trước khi trả về
    const result = devices.map((device) => ({
      device_id: device.device_id, // ID thiết bị
      warehouse_name: device.warehouse ? device.warehouse.name : null, // Tên kho
      type: device.type, // Loại
      location: device.location, // Vị trí
      created_at: device.created_at, // Ngày nhập (Ngày tạo)
      updated_at: device.updated_at, // Thời gian cập nhật
      status: device.status, // Trạng thái hoạt động
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách thiết bị.' });
  }
};
// Sửa thông tin thiết bị
exports.updateDevice = async (req, res) => {
    const { device_id } = req.params;
    const { warehouse_name, type, location, status } = req.body;

    try {
        // Kiểm tra xem kho có tồn tại không
        const warehouse = await Warehouse.findOne({ where: { name: warehouse_name } });
        if (!warehouse) {
            return res.status(404).json({ error: 'Kho không tồn tại.' });
        }

        // Tìm thiết bị cần sửa
        const device = await Device.findByPk(device_id);
        if (!device) {
            return res.status(404).json({ error: 'Thiết bị không tồn tại.' });
        }

        // Cập nhật thông tin thiết bị với warehouse_id tương ứng
        await device.update({
            warehouse_id: warehouse.warehouse_id,
            type: type,
            location: location,
            status: status,
            updated_at: new Date()
        });

        res.status(200).json({ message: 'Cập nhật thiết bị thành công.', device });
    } catch (error) {
        console.error('Error updating device:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thiết bị.' });
    }
};
// Thêm thiết bị
exports.addDevice = async (req, res) => {
    const { warehouse_name, type, location } = req.body;
    const status = false; // Giá trị ban đầu mặc định là false

    try {
        // Kiểm tra xem kho có tồn tại không
        const warehouse = await Warehouse.findOne({ where: { name: warehouse_name } });
        if (!warehouse) {
            return res.status(404).json({ error: 'Kho không tồn tại.' });
        }

        // Thêm thiết bị mới vào cơ sở dữ liệu
        const newDevice = await Device.create({
            warehouse_id: warehouse.warehouse_id, // Sử dụng warehouse_id từ kho tương ứng
            type,
            location,
            status, // Trạng thái mặc định là false
        });

        res.status(201).json({
            message: 'Thiết bị đã được thêm thành công.',
            device: newDevice
        });
    } catch (error) {
        console.error('Error adding device:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm thiết bị.' });
    }
};
//Xóa thiết bị
exports.deleteDevice = async (req, res) => {
    const { device_id } = req.params;

    try {
        // Kiểm tra xem thiết bị có tồn tại không
        const device = await Device.findByPk(device_id);
        if (!device) {
            return res.status(404).json({ error: 'Thiết bị không tồn tại.' });
        }

        // Xóa thiết bị
        await device.destroy();

        res.status(200).json({ message: 'Thiết bị đã được xóa thành công.' });
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa thiết bị.' });
    }
};