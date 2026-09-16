import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAiResponse } from "./utils/OpenAI.js";
import chatRoutes from "./routes/chat.js";
import cookieParser from "cookie-parser";
// import authRoutes from "./routes/auth.js";   // jab auth routes file ban jaye, tab uncomment karo

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",   // tumhara frontend URL, deploy pe production URL daalna
  credentials: true
}));
app.use(cookieParser());

app.use("/api", chatRoutes);
// app.use("/api/auth", authRoutes);   // jab auth routes ban jaye, tab uncomment karo


app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await OpenAiResponse(userMessage);
    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with database ");
  } catch (err) {
    console.error("Failed to connect with DB:", err);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(5000, () => {
    console.log(" Server running on port");
  });
});