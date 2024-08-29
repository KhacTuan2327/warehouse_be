const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
const Warehouse = require('./Warehouse'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
const SensorInfo = require('./SensorInfo'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn

const Sensor = sequelize.define('Sensor', {
  sensor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Warehouse, // Tên model của bảng warehouses
      key: 'warehouse_id', // Tên khóa chính của bảng warehouses
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  info_id: {
    type: DataTypes.INTEGER,
    references: {
      model: SensorInfo, // Tên model của bảng sensor_info
      key: 'info_id', // Tên khóa chính của bảng sensor_info
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL', // Thay đổi thành 'SET NULL' nếu bạn muốn info_id là NULL khi SensorInfo bị xóa
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'sensors', // Tên bảng trong cơ sở dữ liệu
  timestamps: false, // Nếu bạn không muốn Sequelize tự động thêm createdAt và updatedAt
});

// Mối quan hệ với Warehouse
Sensor.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });

// Mối quan hệ với SensorInfo
Sensor.belongsTo(SensorInfo, { foreignKey: 'info_id' });

module.exports = Sensor;
