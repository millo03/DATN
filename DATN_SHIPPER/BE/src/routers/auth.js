import express from "express";
import {
  GetAllUser,
  GetAuthById,
  add_address,
  delete_address,
  get_address,
  signin,
  signup,
  updateUserAddress,
  updateUser,
  logout,
  Get_All_User_Search,
  getAddressById,
  setDefaultAddress,
  GetUsersByEmailOrName,
  newAuthIn7Day,
  getUserAndShipper,
} from "../controllers/Auth/auth";
import { forgotPassword } from "../controllers/Auth/ForgotPass";
import {
  authenticateToken,
  changePassword,
} from "../controllers/Auth/ChangePass";

const Routes_auth = express.Router();
Routes_auth.post("/auth/signup", signup);
Routes_auth.post("/auth/signin", signin);
Routes_auth.post("/auth/logout", logout);
Routes_auth.get("/auth/:userId", GetAuthById);
Routes_auth.put("/auth/:userId", updateUser);
Routes_auth.post("/auth/search", GetUsersByEmailOrName);
Routes_auth.get("/auths/search", Get_All_User_Search);
Routes_auth.get("/auths/new_auth_in_7_day", newAuthIn7Day);

// Routes_auth.put("/auth/${userId}/avatar", updateUserAvatar);
Routes_auth.get("/auths", GetAllUser);
Routes_auth.get("/auths/search", Get_All_User_Search);
Routes_auth.post("/auth/add_address", add_address);
Routes_auth.get("/auth/address/:userId", get_address);
Routes_auth.get("/auth/address/:userId/:addressId", getAddressById);
Routes_auth.put("/auth/:userId/:addressId", updateUserAddress);
Routes_auth.delete("/auth/:userId/:addressId", delete_address);
Routes_auth.patch("/auth/:userId/:addressId/default", setDefaultAddress);
Routes_auth.post("/forgot-password", forgotPassword);
Routes_auth.post("/change-password", authenticateToken, changePassword);

Routes_auth.get("/auths/user-shipper", getUserAndShipper);
export default Routes_auth;
