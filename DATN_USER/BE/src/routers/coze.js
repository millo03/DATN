import { Router } from "express";
import {
  SendMessage,
  GetMessagesByIdUser
  // ReceiveMessage
} from "../controllers/ChatCoze/coze";

const Router_coze = Router();

Router_coze.post("/get_messages", GetMessagesByIdUser);
Router_coze.post("/send_messages", SendMessage);
// Router_coze.get("/receive_messages", ReceiveMessage);

export default Router_coze;
