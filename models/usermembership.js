const mongoose = require("mongoose")

// creating model

const userMembershipSchema = new mongoose.Schema({
    user_id:String,
    membershipPlan_id:String,
    transaction_id:String,
    expDate:Date,
    is_active:Boolean

})
const User_membership = mongoose.model("User_membership",userMembershipSchema)

module.exports = User_membership