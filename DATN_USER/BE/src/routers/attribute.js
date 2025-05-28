import express from "express";
import {
  lay_1_loai_thuoc_tinh,
  lay_1_thuoc_tinh,
  lay_loai_thuoc_tinh,
  lay_tat_ca_thuoc_tinh,
  lay_thuoc_tinh,
  sua_loai_thuoc_tinh,
  sua_thuoc_tinh,
  tao_loai_thuoc_tinh,
  tao_thuoc_tinh,
  xoa_loai_thuoc_tinh,
  xoa_thuoc_tinh,
} from "../controllers/attribute/attribute";

const router_attribute = express.Router();

// the loai thuoc tinh
router_attribute.post(
  "/the_loai_thuoc_tinh/tao_thuoc_tinh",
  tao_loai_thuoc_tinh
);
router_attribute.get(
  "/the_loai_thuoc_tinh/lay_loai_thuoc_tinh/:id_account",
  lay_loai_thuoc_tinh
);
router_attribute.get(
  "/the_loai_thuoc_tinh/lay_1_loai_thuoc_tinh/:id_account",
  lay_1_loai_thuoc_tinh
);
router_attribute.delete(
  "/the_loai_thuoc_tinh/xoa_loai_thuoc_tinh/:id",
  xoa_loai_thuoc_tinh
);
router_attribute.put(
  "/the_loai_thuoc_tinh/sua_loai_thuoc_tinh/:id",
  sua_loai_thuoc_tinh
);

// thuoc tinh
router_attribute.post("/thuoc_tinh/tao_thuoc_tinh", tao_thuoc_tinh);
router_attribute.get("/thuoc_tinh/lay_thuoc_tinh/:id_account", lay_thuoc_tinh);
router_attribute.get("/thuoc_tinh/lay_1_thuoc_tinh/:id_account", lay_1_thuoc_tinh);
router_attribute.put("/thuoc_tinh/sua_thuoc_tinh/:id_account", sua_thuoc_tinh);
router_attribute.delete(
  "/thuoc_tinh/xoa_thuoc_tinh/:id",
  xoa_thuoc_tinh
);
// lấy tất cả thuộc tính
router_attribute.get(
  "/thuoc_tinh/lay_tat_ca_thuoc_tinh",
  lay_tat_ca_thuoc_tinh
);

export default router_attribute;
