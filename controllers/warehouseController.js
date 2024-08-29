const Warehouse = require("../models/warehouse");

// Lấy tất cả kho
exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

// Tạo kho mới
exports.createWarehouse = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Kiểm tra xem tên kho đã tồn tại chưa
    const existingWarehouse = await Warehouse.findOne({ where: { name } });

    if (existingWarehouse) {
      return res.status(400).json({ error: "Tên kho đã tồn tại" });
    }

    // Tạo kho mới nếu tên kho chưa tồn tại
    const newWarehouse = await Warehouse.create({
      name,
      address,
      latitude,
      longitude,
    });

    res.status(201).json(newWarehouse);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo kho" });
  }
};

// Cập nhật kho
exports.updateWarehouse = async (req, res) => {
  try {
    const { warehouse_id } = req.params; // Lấy warehouse_id từ params
    const { name, address, latitude, longitude } = req.body;

    // Kiểm tra trùng tên kho
    const existingWarehouse = await Warehouse.findOne({ where: { name } });
    if (existingWarehouse && existingWarehouse.warehouse_id !== warehouse_id) {
      return res.status(400).json({ error: "Tên kho đã tồn tại" });
    }

    // Cập nhật thông tin kho dựa vào warehouse_id
    const [updated] = await Warehouse.update(
      { name, address, latitude, longitude },
      { where: { warehouse_id } }
    );

    if (updated) {
      const updatedWarehouse = await Warehouse.findOne({
        where: { warehouse_id },
      });
      res.json(updatedWarehouse);
    } else {
      res
        .status(404)
        .json({ error: "Không tìm thấy kho với warehouse_id này" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật kho" });
  }
};

// Xóa kho
exports.deleteWarehouse = async (req, res) => {
  try {
    const { warehouse_id } = req.params;
    const deleted = await Warehouse.destroy({ where: { warehouse_id } });

    if (deleted) {
      res.status(200).json({
        message: `Kho với mã ${warehouse_id} đã được xóa thành công.`,
      });
    } else {
      res
        .status(404)
        .json({ error: `Không tìm thấy kho với mã ${warehouse_id}.` });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa kho" });
  }
};
