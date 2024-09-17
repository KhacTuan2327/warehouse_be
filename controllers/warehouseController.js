const Warehouse = require("../models/Warehouse");
const Sensor = require("../models/Sensor");
const Device = require("../models/Device");
const Alert = require("../models/Alert");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

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
    const existingWarehouse = await Warehouse.findOne({
      where: {
        name,
        warehouse_id: { [Op.ne]: warehouse_id }, // Op.ne dùng để chỉ điều kiện "khác"
      },
    });

    if (existingWarehouse) {
      return res.status(400).json({ error: "Tên kho đã tồn tại" });
    }

    // Cập nhật thông tin kho dựa vào warehouse_id
    const [updated] = await Warehouse.update(
      { name, address, latitude, longitude, updated_at: new Date() },
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
  let t; // Khởi tạo biến t bên ngoài try-catch
  try {
    const { warehouse_id } = req.params;

    // Bắt đầu transaction
    t = await sequelize.transaction();

    // Tìm kho có warehouse_id tương ứng
    const warehouse = await sequelize.query(
      `SELECT * FROM "warehouses" WHERE "warehouse_id" = :warehouse_id`,
      {
        replacements: { warehouse_id },
        type: sequelize.QueryTypes.SELECT,
        transaction: t,
      }
    );

    if (!warehouse || warehouse.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy kho" });
    }

    // Lấy danh sách các sensor_id liên quan đến warehouse_id
    const sensors = await sequelize.query(
      `SELECT "sensor_id" FROM "sensors" WHERE "warehouse_id" = :warehouse_id`,
      {
        replacements: { warehouse_id },
        type: sequelize.QueryTypes.SELECT,
        transaction: t,
      }
    );

    // const sensorIds = sensors.map((sensor) => sensor.sensor_id);

    // Đặt các giá trị sensor_id thành null trong bảng Alerts dựa trên sensor_id
    // if (sensorIds.length > 0) {
    //   await sequelize.query(
    //     `UPDATE "alerts" SET "sensor_id" = NULL WHERE "sensor_id" IN (:sensorIds)`,
    //     {
    //       replacements: { sensorIds },
    //       type: sequelize.QueryTypes.UPDATE,
    //       transaction: t,
    //     }
    //   );
    // }

    // Đặt các giá trị warehouse_id thành null trong bảng Sensors liên quan đến warehouse_id
    await sequelize.query(
      `UPDATE "sensors" SET "warehouse_id" = NULL WHERE "warehouse_id" = :warehouse_id`,
      {
        replacements: { warehouse_id },
        type: sequelize.QueryTypes.UPDATE,
        transaction: t,
      }
    );

    // Đặt các giá trị warehouse_id thành null trong bảng Devices liên quan đến warehouse_id
    await sequelize.query(
      `UPDATE "devices" SET "warehouse_id" = NULL WHERE "warehouse_id" = :warehouse_id`,
      {
        replacements: { warehouse_id },
        type: sequelize.QueryTypes.UPDATE,
        transaction: t,
      }
    );

    // Cuối cùng, xóa kho
    await sequelize.query(
      `DELETE FROM "warehouses" WHERE "warehouse_id" = :warehouse_id`,
      {
        replacements: { warehouse_id },
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      }
    );

    // Commit transaction
    await t.commit();

    res.status(200).json({ message: "Xóa kho thành công" });
  } catch (error) {
    // Rollback transaction nếu có lỗi và nếu transaction đã được khởi tạo
    if (t) await t.rollback();
    console.error("Lỗi khi xóa kho:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
