const mongoose = require("mongoose")

// creating model

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    username : String,
    password:String,
    confPassword:String
})


const User = mongoose.model("User",userSchema)

module.exports = User