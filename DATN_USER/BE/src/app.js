import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/connect";
import Routes_Products from "./routers/products";
import Routes_categories from "./routers/category";
import Routes_orders from "./routers/orders";
import Routes_auth from "./routers/auth";
import Routes_blog from "./routers/blogs";
import Routes_Favorites from "./routers/favoriteProducts";
import Routes_Carts from "./routers/cart";
import Router_Contact from "./routers/contact";
import Routes_payments from "./routers/OnlineCheckoutRoutes";
import Routes_review from "./routers/review";
import Router_Notification from "./routers/notification";
import Route_Shipper from "./routers/shipper";
import Routes_voucher from "./routers/voucher";
import { Server } from "socket.io";
import { createServer } from "http";
import { handle_socket_event } from "./socket/socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import Messages from "./models/Message/Message";
import Router_Message from "./routers/message";
import router_attribute from "./routers/attribute";
import Router_HuyMail from "./routers/sendmail";
import Router_coze from "./routers/coze";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB(process.env.DB_URL);

// Định nghĩa các routes
app.use("/api/v1", Routes_Products);
app.use("/api/v1", Routes_categories);
app.use("/api/v1", Routes_orders);
app.use("/api/v1", Routes_Carts);
app.use("/api/v1", Routes_auth);
app.use("/api/v1", Routes_Favorites);
app.use("/api/v1", Router_Notification);
app.use("/api/v1", Router_Contact);
app.use("/api/v1", Routes_blog);
app.use("/api/v1", Routes_payments);
app.use("/api/v1", Routes_review);
app.use("/api/v1", Route_Shipper);
app.use("/api/v1", Routes_voucher);
app.use("/api/v1", Router_Message);
app.use("/api/v1", Router_HuyMail);
app.use("/api/v1", Router_coze);
app.use("/api/v1", router_attribute);

app.use("/api/v1", Router_HuyMail);
// Định nghĩa một số route khác
// app.get("/profile/allorder", (req, res) => {
//   const amount = req.query.vnp_Amount;
//   const responseCode = req.query.vnp_ResponseCode;
//   const txnRef = req.query.vnp_TxnRef;
//   console.log("Amount: ", amount);
//   console.log("Response Code: ", responseCode);
//   console.log("Transaction Reference: ", txnRef);
//   if (responseCode === "00") {
//     res.send("Giao dịch thành công");
//   } else {
//     res.send("Giao dịch thất bại");
//   }
// });

// Thiết lập Socket.IO server
// web socket
const server_socket = createServer(app)
const io = new Server(server_socket, {
  cors: {
    origin: process.env.HOST_SOCKET || 8888,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});
handle_socket_event(io)

server_socket.listen(process.env.PORT_SOCKET, () => {
  console.log('server running!' + process.env.PORT_SOCKET);
})
// Tạo server HTTP
// Lắng nghe cổng
export const viteNodeApp = app;
