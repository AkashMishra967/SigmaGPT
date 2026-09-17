import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/OpenAI.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get all threads (only logged-in user's threads)
router.get("/thread", verifyToken, async (req, res) => {
    try {
        const threads = await Thread.find({ user: req.user.id }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// Get a single thread's messages (only if it belongs to the logged-in user)
router.get("/thread/:threadId", verifyToken, async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId, user: req.user.id });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// Delete a thread (only if it belongs to the logged-in user)
router.delete("/thread/:threadId", verifyToken, async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, user: req.user.id });
        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// Send a message / create thread
router.post("/chat", verifyToken, async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId, user: req.user.id });

        if (!thread) {
            // create a new thread in db
            thread = new Thread({
                threadId,
                title: message,
                user: req.user.id,
                messages: [{ role: "user", content: message }]
            });
        } else {
            if (!thread.messages) thread.messages = [];
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAIAPIResponse(message);
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();
        await thread.save();

        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;