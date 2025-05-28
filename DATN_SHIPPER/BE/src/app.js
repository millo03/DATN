import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/connect";
import Routes_Products from "./routers/products";
import Routes_categories from "./routers/category";
import Routes_orders from "./routers/orders";
import Routes_auth from "./routers/auth";

import Router_Contact from "./routers/contact";
import Routes_payments from "./routers/OnlineCheckoutRoutes";
import Routes_Attribute from "./routers/attribute";
import { createServer } from 'node:http'
import Router_Notification from "./routers/notification";
import Route_Shipper from "./routers/shipper";
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import Route_Salary from "./routers/salary";
import { handle_socket_event } from "./socket/socket.io";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB(process.env.DB_URL);

// Định nghĩa các routes
app.use("/api/v1", Routes_Products);
app.use("/api/v1", Routes_Attribute);
app.use("/api/v1", Routes_categories);
app.use("/api/v1", Routes_orders);

app.use("/api/v1", Routes_auth);

app.use("/api/v1", Router_Notification);
app.use("/api/v1", Router_Contact);

app.use("/api/v1", Routes_payments);

app.use("/api/v1", Route_Shipper);
app.use("/api/v1", Route_Salary);

// Định nghĩa một số route khác
app.get("/profile/allorder", (req, res) => {
  const amount = req.query.vnp_Amount;
  const responseCode = req.query.vnp_ResponseCode;
  const txnRef = req.query.vnp_TxnRef;
  console.log("Amount: ", amount);
  console.log("Response Code: ", responseCode);
  console.log("Transaction Reference: ", txnRef);
  if (responseCode === "00") {
    res.send("Giao dịch thành công");
  } else {
    res.send("Giao dịch thất bại");
  }
});

export const viteNodeApp = app;
