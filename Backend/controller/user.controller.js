import express from express;
import bcrypt from "bcrypt";
import jwt from "./jsonwebtoken";
const router = express.Router();
import User from "../models/user.model.js"




export const signup = async (req, res) =>{
    try{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message: "All Field are required"});
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
       return res.status(400).json({message: "User Already exist"});
    }
    const hashPassword = await bcrypt.hash(password,10);
    const newUser = new User ({
        username: username,
        email: email,
        password: hashPassword
    })
    await newUser.save();
   return res.status(201).json({message:"User Regrestred Successsfully"});
}catch(error){
 return res.status(500).json({message:"Server Error"});
}}