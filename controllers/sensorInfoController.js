const SensorInfo = require("../models/SensorInfo");
const { Op } = require("sequelize");
const Sensor = require("../models/Sensor");

// Lấy danh sách tất cả dữ liệu của bảng sensor_info
exports.getSensorInfoList = async (req, res) => {
  try {
    const sensorInfoList = await SensorInfo.findAll();
    res.status(200).json(sensorInfoList);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sensor_info:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
// Thêm chi tiết cảm biến
exports.addSensorInfo = async (req, res) => {
  try {
    const {
      sensor_name,
      sensor_type,
      unit,
      max_value,
      min_value,
      noise_factor,
    } = req.body;

    // Kiểm tra xem tên cảm biến đã tồn tại chưa
    const existingSensorInfo = await SensorInfo.findOne({
      where: { sensor_name },
    });
    if (existingSensorInfo) {
      return res
        .status(400)
        .json({ error: "Cảm biến thông tin với tên này đã tồn tại" });
    }

    // Kiểm tra xem đơn vị có phù hợp với loại cảm biến không
    const sensorTypeUnits = {
      "Nhiệt độ": "Celsius",
      "Độ ẩm": "%",
      "Áp suất": "Pa",
      "Ánh sáng": "Lux",
    };

    if (
      !sensorTypeUnits[sensor_type] ||
      unit !== sensorTypeUnits[sensor_type]
    ) {
      return res
        .status(400)
        .json({ error: "Đơn vị không phù hợp với loại cảm biến" });
    }

    // Kiểm tra xem giá trị tối đa có lớn hơn hoặc bằng giá trị tối thiểu không
    if (max_value < min_value) {
      return res.status(400).json({
        error: "Giá trị tối đa phải lớn hơn hoặc bằng giá trị tối thiểu",
      });
    }

    // Tạo và lưu thông tin cảm biến mới
    const newSensorInfo = await SensorInfo.create({
      sensor_name,
      sensor_type,
      unit,
      max_value,
      min_value,
      noise_factor,
    });

    res.status(201).json({
      message: "Thêm thông tin cảm biến thành công",
      sensorInfo: newSensorInfo,
    });
  } catch (error) {
    console.error("Lỗi khi thêm thông tin cảm biến:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
// Cập nhật thông tin cảm biến
exports.updateSensorInfo = async (req, res) => {
  try {
    const { info_id } = req.params;
    const {
      sensor_name,
      sensor_type,
      unit,
      max_value,
      min_value,
      noise_factor,
    } = req.body;

    // Kiểm tra xem cảm biến thông tin có tồn tại không
    const sensorInfo = await SensorInfo.findByPk(info_id);
    if (!sensorInfo) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy thông tin cảm biến" });
    }

    // Kiểm tra xem tên cảm biến có bị trùng không
    const existingSensorInfo = await SensorInfo.findOne({
      where: {
        sensor_name,
        info_id: {
          [Op.ne]: info_id, // Bỏ qua cảm biến thông tin hiện tại
        },
      },
    });
    if (existingSensorInfo) {
      return res.status(400).json({ error: "Cảm biến với tên này đã tồn tại" });
    }

    // Kiểm tra xem đơn vị có phù hợp với loại cảm biến không
    const sensorTypeUnits = {
      "Nhiệt độ": "Celsius",
      "Độ ẩm": "%",
      "Áp suất": "Pa",
      "Ánh sáng": "Lux",
    };

    if (sensorTypeUnits[sensor_type] !== unit) {
      return res
        .status(400)
        .json({ error: "Đơn vị không phù hợp với loại cảm biến" });
    }

    // Cập nhật thông tin cảm biến
    sensorInfo.sensor_name = sensor_name;
    sensorInfo.sensor_type = sensor_type;
    sensorInfo.unit = unit;
    sensorInfo.max_value = max_value;
    sensorInfo.min_value = min_value;
    sensorInfo.noise_factor = noise_factor;
    await sensorInfo.save();

    res.status(200).json({
      message: "Thông tin cảm biến đã được cập nhật thành công",
      sensorInfo,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin cảm biến:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

// Xóa thông tin cảm biến
exports.deleteSensorInfo = async (req, res) => {
  try {
    const { info_id } = req.params;

    // Kiểm tra xem cảm biến có tồn tại không
    const sensor = await SensorInfo.findByPk(info_id);
    if (!sensor) {
      return res.status(404).json({ error: "Cảm biến không được tìm thấy" });
    }

    // Xóa cảm biến
    await Sensor.destroy({
      where: { info_id: info_id },
    });
    await SensorInfo.destroy({
      where: { info_id },
    });

    res.status(200).json({ message: "Cảm biến đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa cảm biến:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
