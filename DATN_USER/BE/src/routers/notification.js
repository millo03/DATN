import { Router } from "express";
import { createNotification, delete_notification, getAllNotification, getNotificationByUser, update_notification } from "../controllers/Notification/notification";

const router = Router();
router.post("/notification", createNotification);
router.get("/notification/:userId", getNotificationByUser);
router.get("/notification/", getAllNotification);
router.put("/notification", update_notification);
router.put("/notification/:id", update_notification);
router.delete("/notification/:id", delete_notification);
export default router