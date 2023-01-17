
const mongoose = require("mongoose")

// creating model

const planSchema = new mongoose.Schema({
    plan_name:String,
    amount:Number,
    validity:Number,
    max_book:Number
})
const plan = mongoose.model("membershipplans",planSchema)

module.exports = plan