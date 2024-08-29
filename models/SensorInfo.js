// models/sensorInfo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn

const SensorInfo = sequelize.define('SensorInfo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    sensor_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    sensor_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    max_value: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    min_value: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    noise_factor: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    tableName: 'sensor_info',
    timestamps: false
});

module.exports = SensorInfo;
