import { Router } from "express";
import {
  adminCancelOrder,
  createOrder,
  createOrderPayment,
  get_orders_client,
  getOneOrderUser,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  userCancelOrder,
  getAllOrdersToday,
  getAllOrderWeek,
  getOrderByDayOfWeek,
  getAllOrderMonth,
  getAllOrderByMonthOfYear,
  getTop10ProductBestSale,
  getOrderByNumberOrPhoneNumber,
  deliverSuccess,
  addShipperOrder,
  adminFailDelivery,

} from "../controllers/Orders/orders";
import { list_items_order_by_user } from "../controllers/Orders/options";
import { checkRole } from "../controllers/Auth/auth";

const router = Router();

router.post("/orders", createOrder);
router.get("/orders", checkRole(["admin", "courier"]), get_orders_client);
router.get("/orders/all_order_of_to_day", getAllOrdersToday);
router.get("/orders/all_order_week", getAllOrderWeek);
router.get("/orders/all_order_month", getAllOrderMonth);
router.get("/orders/all_order_by_day_of_week", getOrderByDayOfWeek);
router.get("/orders/all_order_by_month_of_year", getAllOrderByMonthOfYear);
router.get("/orders/top_10_products_best_sale", getTop10ProductBestSale);
router.get("/orders/FilterNumber/:orderNumber", getOrderByNumber);
router.get("/orders/get_order_user/:userId", getOneOrderUser);
router.get("/orders/:id", getOrderById);
//router.get("/orders/get_10_order_in_day", get10OrderNewInDay);
router.patch("/orders/:id", updateOrderStatus);
router.post("/orders/shipper/:id", addShipperOrder);
router.post("/orders/:id/cancel/confirm", adminCancelOrder);
router.post("/orders/:id/cancel", userCancelOrder);
router.post("/orderspayment", createOrderPayment);
router.post("/orders/search/:id", getOrderByNumberOrPhoneNumber);
router.post("/deliver-success", deliverSuccess);
router.post("/orders/:id/fail-delivery", adminFailDelivery);
router.post("/orders/shipper/:id", addShipperOrder);
// ---
router.get("/list_order/:id_user", list_items_order_by_user);


export default router;
