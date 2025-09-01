import express from "express";
import thread from "../models/thread.js";
const router = express.Router();
import generateOpenAiResponse from "../utils/openai.js";

router.post("/test", async (req,res)=>{
    try{
        const th =new thread({
            threadId:"123456",
            title:"new one"
        });
        const response=await th.save();
        res.send(response);
    }catch(e){
        console.log(e);
        res.json({
            message:"error comes"
        })
    }
});

//Get all threads
router.get("/thread",async (req,res)=>{
    try{
        const threads = await thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    }catch(e){
        res.json({
            message: "Failed to fetch threads"
        })
    }
});

//Get particular thread when you click on it it show on the page
router.get("/thread/:threadId",async (req,res)=>{
    const {threadId}=req.params;
    try{
        const th=await thread.findOne({threadId});
        if(!thread){
            res.json({
                message:"ThreadId not found"
            })
        }
        res.json(th?.messages);
    }catch(e){
        res.json({
            message:"Error will accessing threadId"
        })
    }
});

router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const deletethread=await thread.findOneAndDelete({threadId});
        if(!deletethread){
            res.status(404).json({error:"Thread is not found"});
        }
        res.status(200).json({success: "thread is deleted"})
    }catch(e){
        console.log(e);
        res.json({
            e:"Error will deleting the thread"
        })
    }
});


router.post("/chat",async(req,res)=>{
    const {threadId,message} = req.body;
    if(!threadId || !message){
        return res.status(400).json({error:"missing rrquired fields"});
    }
    try{
        let th = await thread.findOne({ threadId });
        if(!th){
            //create new one 
            th=new thread({
                threadId,
                title:message,
                messages:[{role:"user", content:message}]             //store in db
            });
        }else{
            th.messages.push({role:"user",content:message});        //store in db
        }

        const assiantReply= await generateOpenAiResponse(message);          
        th.messages.push({role:"assistant",content:assiantReply});     //store in db
        th.updatedAt=new Date();
        await th.save();

        res.json({reply:assiantReply});
    }catch(e){
        console.log(e);
        res.status(500).json({e:"Error will sending msg"});
    }
})
export default router;