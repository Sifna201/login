const mongoose = require("mongoose")

// creating model

const otpSchema = new mongoose.Schema({
    email:String,
    code:String,
    expireIn:Number},{timestamps:true})
    const otp = mongoose.model("otp",otpSchema)

    module.exports = otp