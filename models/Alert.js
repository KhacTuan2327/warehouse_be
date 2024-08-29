const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
const Sensor = require("./Sensor"); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn

const Alert = sequelize.define(
  "Alert",
  {
    alert_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sensor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Sensor, // Tên model của bảng sensors
        key: "sensor_id", // Tên khóa chính của bảng sensors
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Khi sensor bị xóa, cảnh báo cũng sẽ bị xóa
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "alerts", // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Nếu bạn không muốn Sequelize tự động thêm createdAt và updatedAt
  }
);

// Mối quan hệ với Sensor
Alert.belongsTo(Sensor, { foreignKey: "sensor_id" });

module.exports = Alert;
