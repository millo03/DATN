import express from "express";
// import {
//   createAttribute,
//   getAttributes,
//   updateAttribute,
//   deleteAttribute,
// } from "../controllers/attribute";
import {
  getAllAttributes,
  getAttributeById,
} from "../controllers/attribute/attribute";

const Routes_Attribute = express.Router();
//Route tạo mới 1 thuộc tính
// router.post("/attributes", createAttribute);

//Route để thêm giá trị cho thuộc tính đã tồn tại
// router.post("/attributes/:id/values", createValueAttribute);

//Route lấy tất cả các thuộc tính
Routes_Attribute.get("/attributes", getAllAttributes);

//Route lấy 1 thuộc tính theo id
Routes_Attribute.get("/attributes/:id", getAttributeById);

//Route để xóa 1 thuộc tính
// router.delete("/attributes/:id", deleteAttribute);

//Route để cập nhật 1 thuộc tính
// router.put("/attributes/:id", updateAttribute);

export default Routes_Attribute;
