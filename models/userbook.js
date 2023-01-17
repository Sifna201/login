const mongoose = require("mongoose")

// creating model

const userBookSchema = new mongoose.Schema({
    customertId:String,
    bookId:String,
    date:Date,
    fine:Number
})


const UserBook = mongoose.model("userBookList",userBookSchema)

module.exports = UserBook