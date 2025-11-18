import express from "express";
import thread from "../models/thread.js";
const router = express.Router();
import generateOpenAiResponse from "../utils/openai.js";
import 'dotenv/config';
import multer from 'multer';
import {Queue} from "bullmq";
import { GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import cloudinary from "../src/uploadCloudinary.js";
import fs from "fs"

import cors from 'cors'
import { generateTitleFromMessage } from "../utils/summary.js";
import PDFfile from "../models/PDFfile.js";
const app=express();
app.use(cors())

const queue=new Queue("file-upload-queue",{
  connection: {
      host: 'localhost',  // or process.env.VALKEY_HOST
      port: 6379          // or process.env.VALKEY_PORT
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
        if(!th){
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






// //pdf
const upload = multer({ dest: "uploads/" }); 

router.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  try {


    //upload to cloudinary
    const localpath=req.file?.path;
    const cloudUpload=await cloudinary.uploader.upload(localpath!,{
      folder:"pdfs",
      resource_type:"raw"
    })

    //delete tempfile
    if(localpath) fs.unlinkSync(localpath);


    //save cloud url to DB
    const pdf = await PDFfile.create({
      originalName: req.file?.originalname,
      filename: cloudUpload.public_id,  
      path: cloudUpload.secure_url, 
      embedded: false,
    });

    // 1 Link PDF to thread
    let {threadId,message}=req.body;
    let th;
    if (threadId) {
    th = await thread.findOne({ threadId });
    if (!th) {
        console.log(`Thread ${threadId} not found → creating new thread`);
        const shortTitle = await generateTitleFromMessage(message);
        th = new thread({ threadId, title: shortTitle, messages: [], pdfId: [pdf._id] });
        await th.save();
    } else {
        th.pdfId.push(pdf._id);
        th.updatedAt = new Date();
        await th.save();
    }
    } else {
    console.log("No threadId provided in body → creating new thread");
    const newThreadId = Date.now().toString(); // or use UUID
    th = new thread({ threadId: newThreadId, title: "New Thread", messages: [], pdfId: [pdf._id] });
    await th.save();
    }


    // 2 Add to queue
    await queue.add('file-ready', JSON.stringify({
      filename: req.file?.originalname,
      path: cloudUpload.secure_url
    }));

    res.json({ message: "Uploaded successfully!" });
  } catch (err) {
    console.error(" Upload failed:", err);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
});

// // Get all uploaded PDFs (for history)
router.get("/pdf/history", async (req, res) => {
  try {
    const pdfs = await PDFfile.find().sort({ uploadedAt: -1 });
    res.json(pdfs);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ message: "Error fetching uploaded PDFs" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // --- Fetch or create thread ---
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

    let assistantReply;

    // --- Check if thread has PDFs ---
    if (th.pdfId && th.pdfId.length > 0) {
      console.log("PDFs found → using Gemini with context");

      // 1️ Build embeddings retriever
      const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        apiKey: process.env.GEMINI_RAG_KEY || "",
      });

      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: "http://localhost:6333",
          collectionName: "langchainjs-testing",
        }
      );

      const retriever = vectorStore.asRetriever({ k: 3 });
      const results = await retriever.invoke(message);

      // 2️ System prompt
      const SYSTEM_PROMPT = `You are a helpful assistant that answers questions based on the provided PDF context. 
      If the answer exists in the context, answer from context.
      If the context does not contain the answer, rely on your general knowledge.
      Do not say "context not provided". 
      Instead, answer naturally.
      Context: ${JSON.stringify(results)}`;

      // 3️ Gemini chat
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_RAG_KEY || "",
      });

      const response = await model.invoke([
        ["system", SYSTEM_PROMPT],
        ["human", message],
      ]);

       if (typeof response.content === "string") {
        assistantReply = response.content;
      } else if (Array.isArray(response.content)) {
        assistantReply = response.content
          .map((block) => ("text" in block ? block.text : ""))
          .join("");
      } else {
        assistantReply = "Sorry, I couldn’t generate a proper response.";
      }
    } else {
      console.log("No PDFs → using standard OpenAI reply");
      assistantReply = await generateOpenAiResponse(message);
    }

    // --- Save and return ---
    th.messages.push({ role: "assistant", content: assistantReply });
    th.updatedAt = new Date();
    await th.save();

    res.json({ reply: assistantReply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error while sending message" });
  }
});

export default router;