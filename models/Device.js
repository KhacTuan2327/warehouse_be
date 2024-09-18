const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Warehouse = require("./Warehouse");

class Device extends Model {}

Device.init(
  {
    device_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    device_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["client", "gateway"]],
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Warehouse,
        key: "warehouse_id",
      },
      onDelete: "SET NULL",
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Device",
    tableName: "devices",
    timestamps: false, // Nếu không sử dụng các trường thời gian tự động
  }
);

Device.belongsTo(Warehouse, {
  foreignKey: "warehouse_id",
  as: "warehouse",
});

module.exports = Device;
