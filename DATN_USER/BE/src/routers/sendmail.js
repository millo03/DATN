import express from 'express';
import SendCancellationMail from '../controllers/SendMail/HuyMail'; // Đường dẫn đến hàm SendCancellationMail

const Router_HuyMail = express.Router();

Router_HuyMail.post('/send-cancellation-email', async (req, res) => {
  const { email, order, cancellationReason } = req.body;
  console.log("Lý do hủy từ frontend (BE):", cancellationReason);
  try {
    // Gọi hàm SendCancellationMail để gửi email
    await SendCancellationMail(email, order, cancellationReason);
    res.status(200).json({ message: 'Email đã được gửi thành công.' });
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi gửi email.' });
  }
});

export default Router_HuyMail;
