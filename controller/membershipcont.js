const transaction= require('../models/transaction');
const User_membership = require('../models/usermembership');
const membership_plan = require('../models/membershipplan');
const userData= require("../models/user.js")

const date=require("date-and-time");
const userBook = require('../models/userbook');
const { findOneAndDelete } = require('../models/userbook');

class membershipcont{
   
async membership  (membershipPlan_id,transaction_id,validity)  {

 console.log(req.user)
 const date1=new Date()
 const expdate=date.addDays(date1,req.body.validity)
 let data=await membership_plan.findOne({_id:membershipPlan_id})
 const membership1=await User_membership.create({user_id:req.user,
    membershipPlan_id:membershipPlan_id,
    transaction_id:transaction_id,
    expDate:expdate
  } )
  return "{'status':'success','message':'success'}"
  
}
  
  async userBookList (bookId) {
  
  const userbook=await userBook.create({
  customertId:req.user,
  bookId:bookId,
  date:new Date()
  
  

  
  })
  return "{status:'success','message':'success'}"

}
async bookreturn(bookId)  {
  let date1=new Date()
  let data=await userBook.findOne({bookId:bookId})
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
  await userBook.findOneAndUpdate(bookId,{fineid:trans.id})
  }
  else{
    var fine=0
  }
  
  userBook.findOneAndUpdate(bookId,{
    returndate:date1}
  ,function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
     
      console.log(docs)
      return "{'status':'success','message':'return successfully'}"
    }
});
  
  
     
}}
module.exports=membershipcont