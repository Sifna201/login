const mongoose = require("mongoose")

// creating model

const groupSchema = new mongoose.Schema({
    book_id:String,
    category_id:String})
    const group= mongoose.model("categoriesGroup",groupSchema)

    module.exports = group