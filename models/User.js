const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true, // Có thể null
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true, // Có thể null
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false, // Vì bạn đã có trường created_at nên không cần tạo thêm timestamp mặc định
  }
);

module.exports = User;
