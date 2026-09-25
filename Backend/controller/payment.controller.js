import { razorpayInstance } from "../utils/razorpay.js";
import crypto from "crypto";
import User from "../models/user.model.js";

// Step 1: Order create karo
export const createOrder = async (req, res) => {
    try {
        const options = {
            amount: 19900,   // amount PAISE me hota hai! 19900 paise = ₹199
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json(order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to create order" });
    }
};

// Step 2: Payment verify karo (jab user payment kar de)
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Signature banake check karo ki payment genuine hai (tampered nahi hai)
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        // Signature match hua — user ko Premium banao
        const user = await User.findById(req.user.id);
        user.isPremium = true;
        await user.save();

        return res.status(200).json({ message: "Payment verified, you are now Premium!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};