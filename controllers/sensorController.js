// controllers/sensorController.js

const Sensor = require("../models/Sensor");
const Warehouse = require("../models/Warehouse");
const SensorInfo = require("../models/SensorInfo");
const Alert = require("../models/Alert");

// Hàm để lấy danh sách các cảm biến
exports.getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      attributes: ["sensor_id", "location", "status", "updated_at"],
      include: [
        {
          model: Warehouse,
          attributes: ["name"], // Lấy tên kho từ bảng warehouses
        },
        {
          model: SensorInfo,
          attributes: [
            "sensor_name",
            "sensor_type",
            "unit",
            "min_value",
            "max_value",
            "noise_factor",
          ], // Lấy thông tin từ bảng sensor_info
        },
      ],
    });

    // Format dữ liệu trả về
    const sensorList = sensors.map((sensor) => ({
      sensor_id: sensor.sensor_id,
      sensor_name: sensor.SensorInfo ? sensor.SensorInfo.sensor_name : null, // Kiểm tra SensorInfo có tồn tại không
      sensor_type: sensor.SensorInfo ? sensor.SensorInfo.sensor_type : null, // Kiểm tra SensorInfo có tồn tại không
      warehouse_name: sensor.Warehouse ? sensor.Warehouse.name : null, // Kiểm tra Warehouse có tồn tại không
      status: sensor.status,
      unit: sensor.SensorInfo ? sensor.SensorInfo.unit : null, // Kiểm tra SensorInfo có tồn tại không
      min_value: sensor.SensorInfo ? sensor.SensorInfo.min_value : null, // Kiểm tra SensorInfo có tồn tại không
      max_value: sensor.SensorInfo ? sensor.SensorInfo.max_value : null, // Kiểm tra SensorInfo có tồn tại không
      noise_factor: sensor.SensorInfo ? sensor.SensorInfo.noise_factor : null, // Kiểm tra SensorInfo có tồn tại không
      location: sensor.location,
      updated_at: sensor.updated_at,
    }));

    res.json(sensorList);
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi lấy dữ liệu cảm biến." });
  }
};

// Hàm để cập nhật dữ liệu cảm biến
exports.updateSensor = async (req, res) => {
  try {
    const { sensor_id } = req.params;
    const { warehouse_name, location, status, sensor_name } = req.body;

    // Kiểm tra xem kho với tên được cung cấp có tồn tại không
    const warehouse = await Warehouse.findOne({
      where: { name: warehouse_name },
    });

    if (!warehouse) {
      return res.status(404).json({ error: "Không tìm thấy kho" });
    }

    // Tìm cảm biến theo ID
    const sensor = await Sensor.findByPk(sensor_id);

    if (!sensor) {
      return res.status(404).json({ error: "Không tìm thấy cảm biến" });
    }

    // Kiểm tra xem cảm biến thông tin với tên được cung cấp có tồn tại không
    const sensorInfo = await SensorInfo.findOne({
      where: { sensor_name: sensor_name },
    });
    if (!sensorInfo) {
      return res
        .status(404)
        .json({ error: "Cảm biến thông tin với tên này không tồn tại" });
    }

    // Cập nhật dữ liệu cảm biến với warehouse_id và info_id tương ứng
    await sensor.update({
      warehouse_id: warehouse.warehouse_id, // Cập nhật warehouse_id từ kho tương ứng
      location: location,
      status: status,
      info_id: sensorInfo.info_id, // Cập nhật info_id từ sensor_info tương ứng
      updated_at: new Date(),
    });

    res.status(200).json({ message: "Cập nhật cảm biến thành công", sensor });
  } catch (error) {
    console.error("Lỗi khi cập nhật cảm biến:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

// Hàm xóa cảm biến
exports.deleteSensor = async (req, res) => {
  try {
    const { sensor_id } = req.params;

    // Tìm cảm biến theo sensor_id (khóa chính)
    const sensor = await Sensor.findOne({ where: { sensor_id: sensor_id } });

    if (!sensor) {
      return res.status(404).json({ error: "Không tìm thấy cảm biến" });
    }
    await Alert.destroy({ where: { sensor_id: sensor_id } });
    // Xóa cảm biến
    await sensor.destroy();

    res.status(200).json({ message: "Xóa cảm biến thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa cảm biến:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

//Hàm thêm cảm biến
exports.addSensor = async (req, res) => {
  try {
    const { name, location, sensor_name } = req.body;

    // Kiểm tra xem kho có tồn tại hay không
    const warehouse = await Warehouse.findOne({ where: { name: name } });
    if (!warehouse) {
      return res.status(404).json({ error: "Không tìm thấy kho" });
    }

    // Kiểm tra xem cảm biến thông tin có tồn tại không
    const sensorInfo = await SensorInfo.findOne({
      where: { sensor_name: sensor_name },
    });
    if (!sensorInfo) {
      return res
        .status(404)
        .json({ error: "Cảm biến thông tin với tên này không tồn tại" });
    }

    // Tạo mới cảm biến và lưu vào cơ sở dữ liệu với warehouse_id và info_id
    const newSensor = await Sensor.create({
      warehouse_id: warehouse.warehouse_id,
      location,
      status: false,
      info_id: sensorInfo.info_id, // Đặt info_id từ sensor_info
    });

    res
      .status(201)
      .json({ message: "Thêm cảm biến thành công", sensor: newSensor });
  } catch (error) {
    console.error("Lỗi khi thêm cảm biến:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
