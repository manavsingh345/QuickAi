import mongoose, { Schema } from "mongoose";
const PdfSchema=new Schema({
    filename:{type:String,required:true},
    originalName:{type:String,required:true},
    path:{type:String,require:true},
    uploadedAt:{type:Date,default: Date.now},
    embedded:{type:Boolean,require:true}
})

export default mongoose.model("PdfFile",PdfSchema);