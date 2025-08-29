import express from "express";
import thread from "../models/thread.js";
const router = express.Router();

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
export default router;