import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
import User from "../models/user.model.js"
import { sendOtpEmail } from "../utils/sendEmail.js";




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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({message:"Login Succcessfullly",
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







export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};






export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }

        // 6-digit random OTP generate karo
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // OTP aur expiry (10 minute) database me save karo
        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Email bhejo
        await sendOtpEmail(email, otp);

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // OTP check karo
        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Expiry check karo
        if (Date.now() > user.resetOtpExpiry) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Naya password hash karke save karo
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};