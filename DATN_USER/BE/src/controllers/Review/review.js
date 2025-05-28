import Products from "../../models/Items/Products.js";
import User from "../../models/Auth/users.js";
import Review from "../../models/review/review.js";
import Order from "../../models/Orders/orders.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const addReviewProduct = async (req, res) => {
  try {
    const { userId } = req.params;
    const { orderId, productId, contentReview, rating_review, image_review } =
      req.body;

    // Kiểm tra nội dung review
    if (!contentReview || typeof contentReview !== "string") {
      return res
        .status(400)
        .json({ error: "nội dung review là bắt buộc và phải là 1 chuỗi" });
    }

    // Kiểm tra rating
    if (
      !rating_review ||
      typeof rating_review !== "number" ||
      rating_review < 1 ||
      rating_review > 5
    ) {
      return res
        .status(400)
        .json({ error: "Rating phải nằm trong khoảng từ 1 đến 5" });
    }

    // Kiểm tra hình ảnh
    // if (
    //   !image_review ||
    //   !Array.isArray(image_review) ||
    //   image_review.length === 0
    // ) {
    //   return res
    //     .status(400)
    //     .json({ error: "Ít nhất phải có 1 hình ảnh trong review" });
    // }

    // Tìm sản phẩm và đơn hàng
    const product = await Products.findById(productId);
    if (!product) return res.status(404).json({ error: "ProductId not found" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "OrderId not found" });

    // Kiểm tra review tồn tại
    const existingReview = await Review.findOne({ orderId, productId, userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "Bạn đã đánh giá sản phẩm này trong đơn hàng rồi!" });
    }

    // Tạo review mới
    const newReview = new Review({
      userId,
      orderId,
      productId,
      contentReview,
      rating_review,
      image_review,
    });

    const saveReview = await newReview.save();

    // Cập nhật reviews trong product và order
    product.reviews.push(saveReview._id);
    await product.save();

    order.reviews.push(saveReview._id);
    await order.save();

    res.status(201).json({
      message: "Review added successfully",
      saveReview,
    });

    // Cập nhật trung bình sao của sản phẩm
    await Products.updateAverageRating(productId);
  } catch (error) {
    console.error("Failed to add review:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllReviewsInProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Kiểm tra xem productId có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Tìm product và populate reviews
    const product = await Products.findById(productId).populate({
      path: "reviews",
      populate: {
        path: "userId", // Populate userId để lấy thông tin người dùng
        select: "userName", // Chọn các trường bạn cần
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Trả về các reviews của sản phẩm
    return res
      .status(200)
      .json({ message: "Product reviews:", reviews: product.reviews });
  } catch (error) {
    console.error("Error getting reviews:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateReviewProduct = async (req, res) => {
  try {
    const { userId, productId, reviewId } = req.params;
    const { contentReview, rating_review, image_review } = req.body;

    const review = await Review.findById(reviewId);
    if (!review)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });

    if (review.productId.toString() !== productId.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Review does not belong to this product" });
    }

    if (!review.userId.equals(userId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "You can only update your own review" });
    }

    // Cập nhật các trường nếu có
    if (contentReview) review.contentReview = contentReview;
    if (rating_review && rating_review >= 1 && rating_review <= 5)
      review.rating_review = rating_review;
    if (image_review && Array.isArray(image_review) && image_review.length > 0)
      review.image_review = image_review;

    review.updatedAt = Date.now();
    await review.save();

    // Cập nhật trung bình sao của sản phẩm
    await Products.updateAverageRating(productId);

    return res
      .status(StatusCodes.OK)
      .json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Failed to update review:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const deleteReviewProduct = async (req, res) => {
  try {
    // Kiểm tra và lấy dữ liệu từ req.params
    const { userId, orderId, productId, reviewId } = req.params;

    // Kiểm tra các tham số đầu vào
    if (!userId || !orderId || !productId || !reviewId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Thiếu thông tin đầu vào" });
    }

    // Tìm sản phẩm theo productId
    const product = await Products.findById(productId);
    if (!product) {
      console.log("Product not found");
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Product not found" });
    }

    // Tìm review theo reviewId
    const review = await Review.findById(reviewId);
    if (!review) {
      console.log("Review not found");
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Review not found" });
    }

    // Kiểm tra xem review có thuộc về sản phẩm và người dùng hiện tại không
    if (review.productId.toString() !== productId.toString()) {
      console.log("Review does not belong to this product");
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Review does not belong to this product" });
    }

    if (review.userId.toString() !== userId.toString()) {
      console.log("You can only delete your own review");
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Bạn chỉ có thể xóa review của bạn mà thôi!" });
    }

    // Xóa review khỏi sản phẩm
    product.reviews.pull(reviewId);
    await product.save();

    // Xóa review khỏi đơn hàng (nếu có)
    await Order.updateMany({ _id: orderId }, { $pull: { reviews: reviewId } });

    // Xóa review khỏi cơ sở dữ liệu
    await Review.findByIdAndDelete(reviewId);

    await Products.updateAverageRating(productId);

    console.log("Review deleted successfully");
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xóa review thành công" });
  } catch (error) {
    console.error("Xóa review thất bại:", error.message);

    // Kiểm tra lỗi cụ thể liên quan đến JSON
    if (error instanceof SyntaxError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Dữ liệu đầu vào không hợp lệ" });
    }

    // Xử lý lỗi khác
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Có lỗi xảy ra trong quá trình xử lý" });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Kiểm tra xem reviewId có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    // Tìm review và populate productId và userId
    const review = await Review.findById(reviewId)
      .populate("productId", "productName") // Populate productId và chỉ lấy trường productName
      .populate("userId", "userName"); // Populate userId và chỉ lấy trường userName

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Trả về thông tin review, sản phẩm và người dùng
    return res.status(200).json({ review });
  } catch (error) {
    console.error("Failed to get review:", error);
    return res.status(500).json({ error: error.message });
  }
};
