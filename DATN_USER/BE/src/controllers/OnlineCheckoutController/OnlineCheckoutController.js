import moment from "moment";
import crypto from "crypto";
import qs from "qs";
import axios from "axios";
import express from "express";

const app = express();
const tmnCode = "N4OAU1DW";
const secretKey = "F4FX3YXLUF6X6KFACETVIFBRB46YS8IK";
const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const returnUrl = "http://localhost:2004/api/v1/return";

// Hàm sắp xếp object
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort(); // Sắp xếp các keys
  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });
  return sorted;
}

// Hàm tạo URL thanh toán
export function createPaymentUrl(req, res, next) {
  const { orderId, totalPrice, orderDescription, language, bankCode, discountAmount = 0, delivery_fee = 0 } = req.body;
  const finalAmount = totalPrice + delivery_fee - discountAmount;
  // Kiểm tra đầu vào
  if (isNaN(finalAmount) || finalAmount <= 0) {
    return res.status(400).json({ error: "Tổng tiền không hợp lệ" });
  }

  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  const createDate = moment().format("YYYYMMDDHHmmss");
  const currCode = "VND";
  
  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: language || "vn",
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `${orderDescription} ${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: finalAmount  * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;
  const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

  res.json({ paymentUrl });
}

// Hàm xử lý phản hồi từ VNPay
export function returnUrll(req, res, next) {
  let vnp_Params = req.query;

  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey); 
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  if (secureHash === signed) {
    const responseCode = vnp_Params['vnp_ResponseCode'];

    if (responseCode === '00') {
      const queryParams = qs.stringify(vnp_Params, { encode: false });
      res.redirect(`http://localhost:7899/profile/list_order?${queryParams}`);
    } else if (responseCode === '01') {
      res.redirect('http://localhost:7899/cart/pay');
    } else {
      res.redirect('http://localhost:7899/cart/pay');
    }
  } else {
    res.redirect('http://localhost:7899/cart/pay?error=invalid_signature');
  }
}
