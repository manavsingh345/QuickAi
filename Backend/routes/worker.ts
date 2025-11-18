import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import PDFfile from "../models/PDFfile.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import os from "os";
import path from "path";

dotenv.config();

mongoose.connect(process.env.MONGO_URL! )
  .then(() => console.log("Worker connected to DB"))
  .catch(err => console.error("Worker DB error:", err));

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log(" Job received:", job.data);
    const data = JSON.parse(job.data);


      // 1 Download Cloudinary file to temp
    const tmpFile = path.join(os.tmpdir(), `file-${Date.now()}`);
    const response = await axios.get(data.path, { responseType: "arraybuffer" });
    fs.writeFileSync(tmpFile, response.data);

    // 2 Always treat document as PDF (Cloudinary raw removes extension)
    let loader = new PDFLoader(tmpFile);

    const docs = await loader.load();

    // Delete temp file after loading
    fs.unlinkSync(tmpFile);


    // 2 Split PDF into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 50,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // 3 Embeddings using Gemini
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GEMINI_API_KEY || "",
    });

    // 4 Store chunks in Qdrant 
   const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "langchainjs-testing",
    });

    console.log("Deleting old vectors...");

    await vectorStore.client.delete("langchainjs-testing", {
      filter: { must: [] }  // delete ALL vectors
    });
    console.log("Old chunks deleted!");

    await vectorStore.addDocuments(splitDocs);
    await PDFfile.findOneAndUpdate({path:data.path},{embedded:true});    //store pdf path in mongodb
    console.log("PDF chunks stored in Qdrant!");
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
