import mongoose, { Schema } from "mongoose";
const PdfSchema=new Schema({
    filename:{type:String,require:true},
    originalName:{type:String,require:true},
    path:{type:String,require:true},
    uploadedAt:{type:Date,default: Date.now},
    embedded:{type:Boolean,require:true}
})

export default mongoose.model("PdfFile",PdfSchema);