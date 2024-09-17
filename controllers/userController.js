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
//xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Tìm người dùng có user_id tương ứng
    const user = await User.findOne({ where: { id: user_id } });

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    // Đặt các giá trị khóa ngoại của người dùng liên quan (nếu có) về NULL (nếu cần)
    // Ví dụ: Cập nhật các bảng liên quan nếu có bảng khác phụ thuộc vào user_id.

    // Xóa người dùng
    await user.destroy();

    res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa tài khoản:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

//sửa thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { username, password, first_name, last_name, role } = req.body;

    // Tìm người dùng có user_id tương ứng
    const user = await User.findOne({ where: { id: user_id } });

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    // Kiểm tra xem username đã tồn tại chưa (ngoại trừ người dùng hiện tại)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: "Username đã tồn tại" });
      }
    }

    // Nếu có mật khẩu mới, mã hóa mật khẩu trước khi cập nhật
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(password, salt);
    }

    // Cập nhật các thông tin khác
    user.username = username || user.username;
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.role = role || user.role;

    // Lưu các thay đổi
    await user.save();

    res.status(200).json({ message: "Cập nhật thông tin thành công", user });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
