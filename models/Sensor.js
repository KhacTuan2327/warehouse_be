const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
const Warehouse = require('./Warehouse'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn

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
    type: DataTypes.STRING,
    allowNull: false,
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

Sensor.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });

module.exports = Sensor;
