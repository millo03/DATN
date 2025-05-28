import { Router } from "express";
import {
  getAllMessages,
  getMessagesBetweenUsers,
  sendMessage
} from "../controllers/Message/message";

const Router_Message = Router();
Router_Message.post("/message/send", sendMessage);
Router_Message.get("/messages/:userId1/:userId2", getMessagesBetweenUsers);
Router_Message.get("/messages", getAllMessages);
export default Router_Message;
