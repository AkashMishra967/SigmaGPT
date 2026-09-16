import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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



export const login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All Field are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Crenditional"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid Creditional"});
        }
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        return res.status(200).json({message:"Login Succcessfullly",
        token : token,
        user :{
            id: user._id,
            email : user.email,
            username: user.username

        }
        })
    }catch(error){
        return res.status(500).json({message:"Server Error"})
    }
}

export const logout = async(req,res) =>{
    try{
    res.clearCookie("token",{
        httpOnly: true,
        secure: process.env.NODE_ENV ==="production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    })
    return res.status(200).json({message:"Logout Successfully"});

}catch(error){
return res.status(500).json({message:"server error"});
}
}














