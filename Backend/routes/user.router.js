import express from "express";
import {signup,login,logout,getMe} from "../controller/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router  = express.Router();


router.post("/signup",signup);
router.post("/login",login);
router.get("/me", verifyToken, getMe);
router.post("/logout", verifyToken,logout);


export default router;