import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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

async function SendDeliverySuccessMailToAdmin(order) {
  const { _id: orderId, customerInfo, items, totalPrice, updatedAt } = order;
  const { phone, userName, address } = customerInfo;

  const formattedTotalPrice = Number(totalPrice).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const itemList = items
    .map((item) => {
      const {
        productId: { name_product, image_product },
        price_item,
        color_item,
        name_size,
        quantity,
        total_price_item,
      } = item;

      const formattedPrice = Number(price_item).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });

      const formattedTotalPriceItem = Number(total_price_item).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });

      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
            <img src="${image_product}" style="width: 100px; height: 100px;" alt="${name_product}" />
            <p>${name_product}</p>
          </td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${color_item}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
            <div style="background-color: black; color: white; padding: 5px 10px; border-radius: 5px;">${name_size}</div>
          </td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${formattedPrice}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${formattedTotalPriceItem}</td>
        </tr>
      `;
    })
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333; text-align: center;">Thông báo Shipper giao hàng thành công</h1>
        <p>Chào Admin,</p>
        <p>Đơn hàng #${orderId} đã được shipper giao thành công đến khách hàng.</p>
        
        <h2 style="color: #333;">Thông tin khách hàng</h2>
        <p><strong>Tên khách hàng:</strong> ${userName}</p>
        <p><strong>Địa chỉ giao hàng:</strong> ${address}</p>
        <p><strong>Số điện thoại:</strong> ${phone}</p>
        <p><strong>Ngày giao hàng:</strong> ${updatedAt}</p>

        <h2 style="color: #333;">Chi tiết đơn hàng</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #f2f2f2;">Sản phẩm</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #f2f2f2;">Màu</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #f2f2f2;">Size</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #f2f2f2;">Số lượng</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #f2f2f2;">Giá</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #f2f2f2;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemList}
          </tbody>
        </table>
        
        <p style="font-weight: bold; color: red; text-align: right; margin-top: 20px;">Tổng tiền: ${formattedTotalPrice}</p>
        
        <p>Shipper đã giao hàng thành công. Vui lòng kiểm tra thông tin chi tiết.</p>
        
        <p>Trân trọng,</p>
        <p>Website Fashion</p>
      </div>
    </div>
  `;

  try {
    console.log("Sending email to admin...");
    const info = await transporter.sendMail({
      from: `"Website Fashion" <${process.env.SMTP_USER}>`,
      to: "totnghieppoly@gmail.com", // Email admin
      subject: `Thông báo Shipper Giao Hàng Thành Công #${orderId}`,
      text: `Đơn hàng #${orderId} đã được shipper giao thành công. Tổng tiền: ${formattedTotalPrice}`,
      html: htmlContent,
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export default SendDeliverySuccessMailToAdmin;