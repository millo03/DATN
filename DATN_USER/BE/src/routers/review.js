import express from "express";
import {
  addReviewProduct,
  getAllReviewsInProduct,
  deleteReviewProduct,
  updateReviewProduct,
  getReviewById,
} from "../controllers/Review/review.js";
const Routes_review = express.Router();
Routes_review.post("/review/:userId", addReviewProduct);
Routes_review.get("/review/:productId", getAllReviewsInProduct);
Routes_review.get("/reviews/:reviewId", getReviewById);
Routes_review.put(
  "/review/:userId/:productId/:reviewId/:orderId",
  updateReviewProduct
);
Routes_review.delete(
  "/review/:userId/:productId/:reviewId/:orderId",
  deleteReviewProduct
);
// Routes_review.get("/review/:reviewId", getReviewById);
// '/api/orders/:orderId/reviews
export default Routes_review;
