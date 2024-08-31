const bcrypt = require("bcryptjs");
require("dotenv").config(); // Nạp biến môi trường từ file .env
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn

//Thêm người dùng
exports.addUser = async (req, res) => {
  try {
    const { username, password, first_name, last_name, role } = req.body;

    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username đã tồn tại" });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Tạo user mới
    const newUser = await User.create({
      username,
      password: hashedPassword,
      first_name,
      last_name,
      role,
    });

    res
      .status(201)
      .json({ message: "Tạo tài khoản thành công", user: newUser });
  } catch (error) {
    console.error("Lỗi khi thêm tài khoản:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
// Hàm đăng nhập
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm người dùng theo username
    const user = await User.findOne({ where: { username } });

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }

    // Tạo JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Thay đổi thời gian hết hạn nếu cần
    );

    // Xác định URL chuyển hướng dựa trên quyền của người dùng
    let redirectUrl;
    if (user.role === "manager") {
      redirectUrl = "http://127.0.0.1:1880/dashboard";
    } else if (user.role === "user") {
      redirectUrl = "http://127.0.0.1:1880/demo";
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    // Trả về token và URL chuyển hướng cùng với thông tin người dùng
    res.status(200).json({
      token,
      redirectUrl,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
