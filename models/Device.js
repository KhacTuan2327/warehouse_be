const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Warehouse = require('./Warehouse');

class Device extends Model {}

Device.init({
  device_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: DataTypes.STRING,
  location: DataTypes.STRING,
  status: DataTypes.BOOLEAN,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'Device',
  tableName: 'devices',
  timestamps: false, // nếu bạn không sử dụng các trường thời gian tự động
});

Device.belongsTo(Warehouse, {
  foreignKey: 'warehouse_id',
  as: 'warehouse'
});

module.exports = Device;
