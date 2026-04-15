import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAiResponse } from "./utils/OpenAI.js";
import chatRoutes from "./routes/chat.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);


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