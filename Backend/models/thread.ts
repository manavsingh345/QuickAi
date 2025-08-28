import mongoose, { Schema } from "mongoose";

const MessageSchema=new Schema({
    role:{type:String, required:true},
    content:{type:String,required:true},
    TimeStamp:{type:Date,default:Date.now}
});

const ThreadSchema=new Schema({
    threadId:{type:String,required:true,unique:true},
    title:{type:String,default:"New Chat By Default"},
    messages:[MessageSchema],
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
    
});

export default mongoose.model("Threads",ThreadSchema);
