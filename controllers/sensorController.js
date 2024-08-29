// controllers/sensorController.js

const Sensor = require('../models/Sensor');
const Warehouse = require('../models/Warehouse');

// Hàm để lấy danh sách các cảm biến
exports.getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      attributes: ['sensor_id', 'location', 'status', 'updated_at'],
      include: [
        {
          model: Warehouse,
          attributes: ['name'], // Lấy tên kho từ bảng warehouses
        },
      ],
    });

    // Format dữ liệu trả về
    const sensorList = sensors.map(sensor => ({
      sensor_id: sensor.sensor_id,
      warehouse_name: sensor.Warehouse.name, // Tên kho
      location: sensor.location,
      status: sensor.status,
      updated_at: sensor.updated_at,
    }));

    res.json(sensorList);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi lấy dữ liệu cảm biến.' });
  }
};

// Hàm để cập nhật dữ liệu cảm biến
exports.updateSensor = async (req, res) => {
    try {
        const { sensor_id } = req.params;
        const { warehouse_name, location, status } = req.body;

        // Kiểm tra xem kho với tên được cung cấp có tồn tại không
        const warehouse = await Warehouse.findOne({ where: { name: warehouse_name } });

        if (!warehouse) {
            return res.status(404).json({ error: 'Không tìm thấy kho' });
        }

        // Tìm cảm biến theo ID
        const sensor = await Sensor.findByPk(sensor_id);

        if (!sensor) {
            return res.status(404).json({ error: 'Không tìm thấy cảm biến' });
        }

        // Cập nhật dữ liệu cảm biến với warehouse_id tương ứng
        await sensor.update({
            warehouse_id: warehouse.warehouse_id, // Cập nhật warehouse_id từ kho tương ứng
            location: location,
            status: status,
            updated_at: new Date()
        });

        res.status(200).json({ message: 'Cập nhật cảm biến thành công', sensor });
    } catch (error) {
        console.error('Lỗi khi cập nhật cảm biến:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// Hàm xóa cảm biến
exports.deleteSensor = async (req, res) => {
    try {
        const { sensor_id } = req.params;

        // Tìm cảm biến theo sensor_id (khóa chính)
        const sensor = await Sensor.findOne({ where: { sensor_id: sensor_id } });

        if (!sensor) {
            return res.status(404).json({ error: 'Không tìm thấy cảm biến' });
        }

        // Xóa cảm biến
        await sensor.destroy();

        res.status(200).json({ message: 'Xóa cảm biến thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa cảm biến:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

//Hàm thêm cảm biến
exports.addSensor = async (req, res) => {
    try {
        const { name, location, status } = req.body;

        // Kiểm tra xem kho có tồn tại hay không
        const warehouse = await Warehouse.findOne({ where: { name: name } });

        if (!warehouse) {
            return res.status(404).json({ error: 'Không tìm thấy kho' });
        }

        // Tạo mới cảm biến và lưu vào cơ sở dữ liệu với warehouse_id
        const newSensor = await Sensor.create({
            warehouse_id: warehouse.warehouse_id,
            location,
            status,
        });

        res.status(201).json({ message: 'Thêm cảm biến thành công', sensor: newSensor });
    } catch (error) {
        console.error('Lỗi khi thêm cảm biến:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
