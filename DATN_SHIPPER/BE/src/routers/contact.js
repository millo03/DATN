import { Router } from "express";
import {
  create_contact,
  delete_contact,
  get_contact,
  getById_contact,
  update,
  getContactByNameOrEmail,
} from "../controllers/contact/contact";

const Router_Contact = Router();

// Định nghĩa các route và gán controller tương ứng
Router_Contact.post("/contact", create_contact);
Router_Contact.get("/contact", get_contact);
Router_Contact.get("/contact/:id", getById_contact);
Router_Contact.delete("/contact/:id", delete_contact);
Router_Contact.put("/contact/feedback/:id", update);
Router_Contact.post("/contacts/search", getContactByNameOrEmail);

export default Router_Contact;
