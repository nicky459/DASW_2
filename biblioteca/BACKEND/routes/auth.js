import express from "express";
import * as authController from "../controllers/auth_controller.js";

let routerAuth = express.Router();

routerAuth.post("/register", authController.register);
routerAuth.post("/login", authController.login);
routerAuth.post("/logout", authController.logout);

export default routerAuth;
