const transaction= require('../models/transaction');
const User_membership = require('../models/usermembership');
const membership_plan = require('../models/membershipplan');
const userData= require("../models/user.js")
const date=require("date-and-time")
module.exports={transaction:async (req, res) => { 
    await transaction.create({
    type:req.body.type,
    amount:req.body.amount,
    user_id:req.body.user_id
})
res.json({status:"success",message:"success"})}
,
membership :async (req, res) => {
 
 const date1=new Date()
 const expdate=date.addDays(date1,req.body.validity)
 let data=await membership_plan.findOne({_id:req.body.membershipPlan_id})
 //validity=data.validity
 console.log(data)
 //expdate=date+validity
 //console.log(expdate)
 await User_membership.create({user_id:req.body.user_id,
    membershipPlan_id:req.body.membershipPlan_id,
    transaction_id:req.body.transaction_id,
    expDate:expdate
  } )
  res.json({status:"success",message:"success"})
}}