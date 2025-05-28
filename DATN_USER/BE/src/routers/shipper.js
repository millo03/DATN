import express from "express";
import {
  createShipper,
  getAllShippers,
  getShipperById,
  updateShipper,
  deleteShipper,
  GetShippersByName,
  verifyEmail,
  add_address,
  get_address,
  getAddressById,
  updateShipperAddress,
  delete_address,
  setDefaultAddress,
} from "../controllers/Shipper/shipper";

const Route_Shipper = express.Router(); // Sử dụng Route_Shipper
// Route_Shipper.post("/shippers/assign-shipper", assignShipperToOrder);

// Tạo mới shipper
Route_Shipper.post("/shippers", createShipper);

//Tìm kiếm theo tên Shipper
Route_Shipper.post("/shippers/search", GetShippersByName);
// Lấy danh sách tất cả các shipper
Route_Shipper.get("/shippers", getAllShippers);

// Xem chi tiết một shipper
Route_Shipper.get("/shippers/:id", getShipperById);

// Cập nhật thông tin shipper
Route_Shipper.put("/shippers/:id", updateShipper);

// Xóa shipper
Route_Shipper.delete("/shippers/:id", deleteShipper);

//Xác thực email
Route_Shipper.get("/verify", verifyEmail);

//Address shipper
Route_Shipper.post("/shippers/add_address", add_address);
Route_Shipper.get("/shippers/address/:userId", get_address);
Route_Shipper.get("/shippers/address/:shipperId/:addressId", getAddressById);
Route_Shipper.put("/shippers/:userId/:addressId", updateShipperAddress);
Route_Shipper.delete("/shippers/:userId/:addressId", delete_address);
Route_Shipper.patch("/shippers/:userId/:addressId/default", setDefaultAddress);

export default Route_Shipper;
