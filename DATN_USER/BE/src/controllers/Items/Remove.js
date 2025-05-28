import Attribute from "../../models/attribute/variant";
import Products from "../../models/Items/Products";
import { StatusCodes } from "http-status-codes";

export const deleteProductById = async (req, res) => {
  try {
    await Products.delete({ _id: req.params.id });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Error deleting product by ID:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Lỗi server!" });
  }
};

export const removeMultipleProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid product IDs" });
    }
    // kiểm tra xem _id có nằm trong 1 mảng productIds không
    const result = await Products.delete({
      _id: { $in: productIds }
    });

    if (result.deletedCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No products found to delete" });
    }

    return res.status(StatusCodes.OK).json({
      message: "Đã xóa sản phẩm thành công",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error deleting multiple products:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Lỗi server!" });
  }
};

export async function destroy_delete(req, res) {
  try {
    await Products.findByIdAndDelete(req.params.id);
    await Attribute.deleteMany({ id_item: req.params.id });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xóa vĩnh viễn thành công" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Lỗi server!"
    });
  }
}
