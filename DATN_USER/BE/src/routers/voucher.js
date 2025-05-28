import express from "express";
import {
  addVoucher,
  deleteVoucher,
  getVoucher,
  getVoucherById,
  updateVoucher,
  useVoucher,
} from "../controllers/Voucher/voucher";

const Routes_voucher = express.Router();

Routes_voucher.get("/voucher", getVoucher);
Routes_voucher.get("/voucher/:id", getVoucherById);
Routes_voucher.post("/voucher", addVoucher);
Routes_voucher.put("/voucher/:id", updateVoucher);
Routes_voucher.delete("/voucher/:id", deleteVoucher);
Routes_voucher.post("/voucher/use", useVoucher);
export default Routes_voucher;
