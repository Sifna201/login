const mongoose = require("mongoose")

// creating model

const transactionSchema = new mongoose.Schema({
    type:String,
    amount:Number,
    user_id:String
})
const transaction = mongoose.model("transaction",transactionSchema)

module.exports = transaction