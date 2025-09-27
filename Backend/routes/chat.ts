import express from "express";
import thread from "../models/thread.js";
const router = express.Router();
import generateOpenAiResponse from "../utils/openai.js";

import cors from 'cors'
import { generateTitleFromMessage } from "../utils/summary.js";
const app=express();
app.use(cors())

import multer from 'multer';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniqueSuffix} - ${file.originalname}`)
  }
})

const upload = multer({  storage: storage  })


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


router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let th = await thread.findOne({ threadId });

    if (!th) {
      const shortTitle = await generateTitleFromMessage(message);

      th = new thread({
        threadId,
        title: shortTitle, 
        messages: [{ role: "user", content: message }],
      });
    } else {
      th.messages.push({ role: "user", content: message });
    }

    const assistantReply = await generateOpenAiResponse(message);
    th.messages.push({ role: "assistant", content: assistantReply });
    th.updatedAt = new Date();
    await th.save();

    res.json({ reply: assistantReply });
  } catch (e) {
    console.log(e);
    res.status(500).json({ e: "Error while sending message" });
  }
});



//pdf
router.post("/upload/pdf",upload.single('pdf'), (req, res)=>{
    return res.json({
        message:"uploaded"
    })
})

export default router;