import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/OpenAI.js";


const router = express.Router();

router.post("/test",async(req,res) =>{
    try{
        const thread = new Thread ({
            threadId:"ayll",
            title:" New Data is sent"
        });
        const response = await thread.save();
        res.send(response);

    }catch(err){
        console.log(err);
        res.status(500).json((err,"Faild to save the db"));
    }
});

// get all threads
router.get("/thread",async(req, res) =>{
    try{
        const threads = await Thread.find({}).sort({updateAt:-1});
        // descending order of updated.. most recent data on top
    res.json(threads);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Faild to fetch the error"});
    }
})


router.get("/thread/:threadId", async(req,res) =>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error:"Thread not found"});
        }
    res.json(thread.messages);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Faild to fetch chat"});
    }

});


router.delete("/thread/:threadId", async (req,res) =>{
    const {threadId} = req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread){
            res.status(404).json({error:"Thread not found"});
        }
        res.status(200).json({sucess:"Thread deleted successfully"});

    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Faild to delete thread"});
    }
})


router.post("/chat",async(req,res) =>{
    const {threadId, message} = req.body;

    if(!threadId || !message){
        res.status(400).json({error:"missing required faild"});
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            // create a new thread in db
            thread = new Thread({
                threadId,
                title:message,
                messages:[{role:"user", content: message}]
            });
        }
        else{
            if(!thread.messages) thread.messages = [];
            thread.messages.push({role: "user", content: message});

        }

const assistantReply = await getOpenAIAPIResponse(message);
thread.messages.push({role: "assistant", content: assistantReply});
thread.updatedAt = new Date();
await thread.save();
res.json({reply: assistantReply});
    } catch(err){
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
})





export default router;