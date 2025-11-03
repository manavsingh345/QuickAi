import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";

import ChatRoutes from "../routes/chat.js"
const app=express();
app.use(express.json())
app.use(cors());
app.use("/api",ChatRoutes);

const ConnectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("connected to DB")
    }catch(e){
        console.log("Error while connecting to DB")
    }
}


app.listen(8000,  ()=>{
    console.log("Port is runnning on port 8000");
     ConnectDB();
})