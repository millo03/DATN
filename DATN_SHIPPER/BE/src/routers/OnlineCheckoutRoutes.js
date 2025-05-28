import { Router } from "express";
const router = Router();
import { createPaymentUrl, returnUrll } from "../controllers/OnlineCheckoutController/OnlineCheckoutController";

// router.get('/orderlist', renderOrderList);
// router.get('/create_payment_url', renderCreatePayment);
// router.get('/querydr', renderQueryDR);
// router.get('/refund', renderRefund);

// router.post('/vnpay', createPaymentUrl);
router.post("/create_payment_url", createPaymentUrl);
router.get('/vnpay-return', returnUrll);
export default router;
