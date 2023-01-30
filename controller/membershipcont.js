const transaction= require('../models/transaction');
const User_membership = require('../models/usermembership');
const membership_plan = require('../models/membershipplan');
const userData= require("../models/user.js")

const date=require("date-and-time");
const userBook = require('../models/userbook');
const { findOneAndDelete } = require('../models/userbook');
const verifyToken=require("./usercont")
module.exports={
   

membership :async (req, res) => {

 console.log(req.user)
 const date1=new Date()
 const expdate=date.addDays(date1,req.body.validity)
 let data=await membership_plan.findOne({_id:req.body.membershipPlan_id})
 //validity=data.validity
 console.log(data)
 //expdate=date+validity
 //console.log(expdate)
 const membership1=await User_membership.create({user_id:req.user,
    membershipPlan_id:req.body.membershipPlan_id,
    transaction_id:req.body.transaction_id,
    expDate:expdate
  } )
  res.json({status:"success",message:"success"})
  
},
  
 userBookList :async (req, res) => {
  console.log(req.user)
  const userbook=await userBook.create({
  customertId:req.user,
  bookId:req.body.bookId,
  date:new Date()
  
  

  
  })
  res.json({status:"success",message:"success"})

},bookreturn :async function get (req, res)  {
  let date1=new Date()
  let data=await userBook.findOne({bookId:req.body.bookid})
  console.log(data)
  let startDate=data.date
  let checkdate=date.addDays(startDate,10)
  console.log(checkdate)
  
  if(date1>checkdate){
    var Difference_In_Time = date1.getTime() - checkdate.getTime(); 

    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log(Difference_In_Days)
    fine=2*Difference_In_Days
   let trans= await transaction.create({
      type:"fine",
      amount:fine,
      userid:req.user
  })
  await userBook.findOneAndUpdate(req.body.bookid,{fineid:trans.id})
  }
  else{
    var fine=0
  }
  
  userBook.findOneAndUpdate(req.body.bookid,{
    returndate:date1}
  ,function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
     
      console.log(docs)
      res.json({status:"success",message:"return successfully"})
    }
});
  
  
     
}}