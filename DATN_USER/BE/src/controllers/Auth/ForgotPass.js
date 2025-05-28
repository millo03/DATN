import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
import User from '../../models/Auth/users.js';
import dotenv from "dotenv";
import passwordGenerator from 'generate-password';

dotenv.config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    // Generate a new password
    const newPassword = passwordGenerator.generate({
      length: 10,
      numbers: true,
    });

    // Hash the new password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Yêu cầu đặt lại mật khẩu',
        html: `
          <p>Xin chào,</p>
          <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Dưới đây là mật khẩu mới của bạn:</p>
          <p>Mật khẩu mới:<strong style="color: red;"> ${newPassword}</strong></p>
          <p>Vui lòng đăng nhập và thay đổi mật khẩu của bạn ngay lập tức để đảm bảo an toàn cho tài khoản của bạn.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.</p>
          <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
        `,
      };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Mật khẩu mới đã được gửi đến email của bạn' });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi đặt lại mật khẩu' });
  }
};