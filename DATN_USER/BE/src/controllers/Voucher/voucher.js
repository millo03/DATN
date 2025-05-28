import Voucher from "../../models/Voucher/voucher";
import Products from "../../models/Items/Products";
import Users from "../../models/Auth/users";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const getVoucher = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json({ message: "Thành công: ", vouchers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);

    if (!voucher) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }

    res.status(200).json({ message: "Thành công: ", voucher });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy voucher", error });
  }
};

const sendEmail = async (
  userName,
  email,
  code_voucher,
  discountType,
  discountValue,
  minimumSpend,
  description_voucher,
  startDate,
  expirationDate
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const formatDate = (date) =>
    new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const formattedStartDate = formatDate(startDate);
  const formattedExpirationDate = formatDate(expirationDate);

  const formattedDiscountValue =
    discountType === "percentage"
      ? `${discountValue}%`
      : `${discountValue.toLocaleString("vi-VN")} đ`;

  const formattedMinimumSpend = `${minimumSpend.toLocaleString("vi-VN")} đ`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "🎉 Ưu đãi đặc biệt dành riêng cho bạn!",
    html: `
      <div style="
        max-width: 600px;
        margin: 0 auto;
        font-family: 'Segoe UI', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
      ">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="
            color: #1a73e8;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          ">Ưu Đãi Đặc Biệt</h1>
        </div>

        <h2 style="
          color: #1a73e8;
          font-size: 20px;
          margin-bottom: 20px;
        ">Xin chào ${userName},</h2>

        <p style="
          font-size: 16px;
          margin-bottom: 25px;
          color: #555;
        ">Chúng tôi vui mừng thông báo bạn đã nhận được <strong>mã giảm giá độc quyền</strong>!</p>

        <div style="
          background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 15px;
          padding: 25px;
          margin: 20px 0;
          border: 2px dashed #1a73e8;
        ">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="
              font-size: 24px;
              font-weight: bold;
              color: #1a73e8;
              background-color: #ffffff;
              padding: 10px 20px;
              border-radius: 8px;
              display: inline-block;
              box-shadow: 0 3px 6px rgba(0,0,0,0.1);
            ">${code_voucher}</div>
          </div>

          <div style="margin-bottom: 3px;">
            <strong style="color: #4a4a4a;">Ưu đãi:</strong> 
            <span style="
              color: #28a745;
              font-weight: bold;
              font-size: 18px;
            ">${formattedDiscountValue}</span>
            <span >với đơn hàng tối thiểu</span>
            <span style="
              color: #1a73e8;
              font-weight: bold;
            ">${formattedMinimumSpend}</span>
          </div>

          <div style="margin-bottom: 3px;">
            <strong style="color: #4a4a4a;">Mô tả:</strong> 
            <span style="color: #666;">${description_voucher}</span>
          </div>

          <div>
            <strong style="color: #4a4a4a;">Thời gian áp dụng:</strong>
            <span style="color: #666;">Từ ${formattedStartDate} đến ${formattedExpirationDate}</span>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:7899/shops" style="
            display: inline-block;
            padding: 12px 30px;
            background-color: #1a73e8;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
            transition: background-color 0.3s;
            box-shadow: 0 4px 6px rgba(26,115,232,0.2);
          ">Mua sắm ngay</a>
        </div>

        <p style="
          text-align: center;
          color: #666;
          margin-top: 30px;
          font-style: italic;
        ">Cảm ơn bạn đã luôn đồng hành cùng chúng tôi!</p>

        <hr style="
          border: none;
          border-top: 1px solid #eee;
          margin: 30px 0;
        ">

        <div style="
          text-align: center;
          font-size: 12px;
          color: #999;
        ">
          <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
          <p>© 2024 Seven. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công.");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

export const addVoucher = async (req, res) => {
  try {
    req.body.code_voucher = req.body.code_voucher.toUpperCase();
    // Kiểm tra xem mã giảm giá đã tồn tại hay chưa
    const existingVoucher = await Voucher.findOne({
      code_voucher: req.body.code_voucher,
    });
    if (existingVoucher) {
      return res.status(400).json({
        message: "Mã giảm giá đã tồn tại, vui lòng sử dụng mã khác.",
      });
    }
    const newVoucher = new Voucher(req.body);
    await newVoucher.save();

    const allowedUsers = req.body.allowedUsers || [];

    if (allowedUsers.length > 0) {
      // Gửi email cho danh sách người dùng cụ thể
      for (const userId of allowedUsers) {
        const user = await Users.findById(userId);
        if (user) {
          await sendEmail(
            user.userName,
            user.email,
            newVoucher.code_voucher,
            newVoucher.discountType,
            newVoucher.discountValue,
            newVoucher.minimumSpend,
            newVoucher.description_voucher,
            newVoucher.startDate,
            newVoucher.expirationDate
          );
        }
      }
    } else {
      // Gửi email cho tất cả người dùng
      const users = await Users.find();
      for (const user of users) {
        await sendEmail(
          user.userName,
          user.email,
          newVoucher.code_voucher,
          newVoucher.discountType,
          newVoucher.discountValue,
          newVoucher.minimumSpend,
          newVoucher.description_voucher,
          newVoucher.startDate,
          newVoucher.expirationDate
        );
      }
    }

    res.status(201).json({
      message: "Thêm mới mã giảm giá thành công",
      voucher: newVoucher,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Mã giảm giá bị trùng, vui lòng thử mã khác.",
      });
    }

    res.status(500).json({ error: error.message });
  }
};

export const deleteVoucher = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(id);
    if (!deletedVoucher)
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json({ message: "Xóa mã giảm giá thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVoucher = async (req, res) => {
  const { id } = req.params;

  try {
    req.body.code_voucher = req.body.code_voucher.toUpperCase();
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedVoucher)
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json({
      message: "Cập nhật mã giảm giá thành công",
      voucher: updatedVoucher,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const useVoucher = async (req, res) => {
  const { code_voucher, totalAmount, userId, selectedProducts } = req.body;

  try {
    // Tìm mã giảm giá theo code và kiểm tra xem nó còn hoạt động không
    const voucher = await Voucher.findOne({ code_voucher, isActive: true });

    if (!voucher) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy mã giảm giá hoặc đã hết hạn" });
    }

    // Kiểm tra nếu voucher chỉ dành cho một số người dùng
    if (
      voucher.allowedUsers.length > 0 &&
      !voucher.allowedUsers.includes("all") &&
      !voucher.allowedUsers.includes(userId)
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không được phép sử dụng mã giảm giá này" });
    }

    // Kiểm tra nếu voucher đã hết số lượng sử dụng
    if (voucher.usedCount >= voucher.quantity_voucher) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã đạt hạn mức sử dụng" });
    }

    // Kiểm tra nếu voucher chưa đến ngày bắt đầu
    if (new Date(voucher.startDate) > new Date()) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá chưa sử dụng được hôm nay!" });
    }

    // Kiểm tra nếu voucher đã hết hạn
    if (new Date(voucher.expirationDate) < new Date()) {
      return res.status(400).json({ message: "Mã giảm giá đã hết hạn" });
    }

    if (voucher.applyType === "product") {
      // Kiểm tra sản phẩm nếu voucher áp dụng cho sản phẩm
      if (voucher.appliedProducts.length === 0) {
        // Nếu không có sản phẩm nào trong appliedProducts, cho phép tất cả sản phẩm
      } else {
        // Kiểm tra xem tất cả sản phẩm đã chọn có hợp lệ không
        const invalidProducts = selectedProducts.filter(
          (productId) => !voucher.appliedProducts.includes(productId)
        );

        if (invalidProducts.length > 0) {
          return res.status(400).json({
            message: `Mã giảm giá không áp dụng cho sản phẩm có ID: ${invalidProducts.join(
              ", "
            )}`,
          });
        }
      }
    } else if (voucher.applyType === "total") {
      // Kiểm tra nếu voucher áp dụng cho tổng số tiền
      if (totalAmount < voucher.minimumSpend) {
        return res.status(400).json({
          message: `Số tiền tối thiểu để sử dụng mã giảm giá này là ${voucher.minimumSpend}`,
        });
      }
    } else if (voucher.applyType === "category") {
      // Kiểm tra danh mục nếu voucher áp dụng cho danh mục sản phẩm
      if (voucher.appliedCategories.length === 0) {
        // Nếu không có danh mục nào trong appliedCategories, cho phép áp dụng cho tất cả danh mục
      } else {
        // Kiểm tra xem có sản phẩm nào không thuộc danh mục hợp lệ không
        const invalidProducts = await Products.find({
          _id: { $in: selectedProducts },
          category_id: { $nin: voucher.appliedCategories },
        });

        if (invalidProducts.length > 0) {
          return res.status(400).json({
            message:
              "Mã giảm giá không áp dụng cho sản phẩm thuộc các danh mục không hợp lệ",
          });
        }
      }
    }

    // Kiểm tra nếu tổng giá trị đơn hàng lớn hơn giá trị giảm giá
    if (totalAmount < voucher.discountValue) {
      return res.status(400).json({
        message: `Tổng giá trị đơn hàng chưa đủ điều kiện để sử dụng mã giảm giá này`,
      });
    }

    // Kiểm tra minimumSpend cho voucher
    if (voucher.minimumSpend > 0 && totalAmount < voucher.minimumSpend) {
      return res.status(400).json({
        message: `Để áp dụng mã giảm giá này, bạn cần chi tiêu ít nhất ${voucher.minimumSpend}`,
      });
    }

    // Tính giá trị giảm giá dựa trên loại mã giảm giá
    let discount = 0;
    if (voucher.discountType === "percentage") {
      discount = (voucher.discountValue / 100) * totalAmount;

      // Kiểm tra nếu vượt quá số tiền tối đa được giảm
      if (voucher.maxDiscount && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount; // Đặt giá trị giảm giá bằng số tiền tối đa
      }
    } else {
      discount = voucher.discountValue;
    }

    // Trả về kết quả bao gồm giá trị giảm giá và số tiền cuối cùng
    res.json({
      message: "Áp dụng mã giảm giá thành công!",
      totalAmount,
      discount,
      finalAmount: totalAmount - discount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
