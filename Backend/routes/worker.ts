import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("📄 Job received:", job.data);
    const data = JSON.parse(job.data);

    // 1️ Load PDF
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();

    // 2️ Split PDF into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 50,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // 3️ Embeddings using Gemini
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: "AIzaSyBhySTpV4nQUxCGVoJRdrlrJxUZTGzfsPk",
    });

    // 4️ Store chunks in Qdrant
   const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "langchainjs-testing",
    });
    await vectorStore.addDocuments(splitDocs);
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
