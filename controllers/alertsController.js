const { Op } = require("sequelize");
const Alert = require("../models/Alert"); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
const Sensor = require("../models/Sensor");
const SensorInfo = require("../models/SensorInfo");
const Warehouse = require("../models/Warehouse");

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      attributes: ["alert_id", "message", "severity", "timestamp", "resolved"],
      include: [
        {
          model: Sensor,
          attributes: ["location"],
          include: [
            {
              model: SensorInfo,
              attributes: ["sensor_name", "sensor_type"],
            },
            {
              model: Warehouse,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    // Format dữ liệu trả về
    const alertList = alerts.map((alert) => ({
      alert_id: alert.alert_id,
      sensor_name: alert.Sensor.SensorInfo.sensor_name, // Tên cảm biến từ bảng sensor_info
      sensor_type: alert.Sensor.SensorInfo.sensor_type, // Loại cảm biến từ bảng sensor_info
      warehouse_name: alert.Sensor.Warehouse.name, // Tên kho từ bảng warehouses
      location: alert.Sensor.location, // Vị trí từ bảng sensors
      message: alert.message, // Nội dung cảnh báo
      severity: alert.severity, // Mức độ cảnh báo
      timestamp: alert.timestamp, // Thời gian cảnh báo
      resolved: alert.resolved, // Trạng thái xử lý
    }));

    res.json(alertList);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu cảnh báo:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi lấy dữ liệu cảnh báo." });
  }
};
//Thêm alert
exports.addAlert = async (req, res) => {
  try {
    const { sensor_name, message, severity, timestamp, resolved } = req.body;

    // Tìm sensor_id dựa trên sensor_name trong bảng sensor_info
    const sensorInfo = await SensorInfo.findOne({
      where: { sensor_name: sensor_name },
    });

    if (!sensorInfo) {
      return res.status(404).json({ error: "Không tìm thấy tên cảm biến" });
    }

    // Tìm sensor dựa trên info_id
    const sensor = await Sensor.findOne({
      where: { info_id: sensorInfo.info_id },
    });

    if (!sensor) {
      return res.status(404).json({ error: "Không tìm thấy cảm biến" });
    }

    // Tạo một alert mới
    const newAlert = await Alert.create({
      sensor_id: sensor.sensor_id,
      message,
      severity,
      timestamp,
      resolved,
    });

    res
      .status(201)
      .json({ message: "Thêm cảnh báo thành công", alert: newAlert });
  } catch (error) {
    console.error("Lỗi khi thêm cảnh báo:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
// Sửa trạng thái của cảnh báo
exports.updateAlertResolved = async (req, res) => {
    try {
      const { alert_id } = req.params; // Lấy alert_id từ tham số URL
      const { resolved } = req.body; // Lấy giá trị resolved từ body của yêu cầu
  
      // Tìm alert theo alert_id
      const alert = await Alert.findByPk(alert_id);
  
      if (!alert) {
        return res.status(404).json({ error: 'Không tìm thấy cảnh báo' });
      }
  
      // Cập nhật trường resolved
      alert.resolved = resolved;
      alert.timestamp = new Date() ;
  
      // Lưu lại thay đổi
      await alert.save();
  
      res.status(200).json({ message: 'Cập nhật trạng thái xử lý thành công', alert });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái xử lý:', error);
      res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
  };