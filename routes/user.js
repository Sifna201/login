var express = require('express');
var router = express.Router();
const multer=require('multer')
var  path = require("path")
var mongoose = require("mongoose")
const bodyParser = require("body-parser") 

const Bookscont=require("../controller/books-controller");
const  membershipcont = require('../controller/membershipcont.js');
const Users = require('../controller/usercontroller.js');
const uplodPath = path.join('../public/images')
const imageTypes = ['images/jpeg', 'images/png',]
const upload = multer({ dest: 'uploads/' })

// router.get("/getstarted",(req,res)=>{
// res.render("register page")
// })
// router.get("/signin",(req,res)=>{
//   res.render("loginpage")
// })
// router.get("/register",(req,res)=>{
// res.redirect("login page")})
router.post("/register",async(req,res)=>{
  const { name,email,phone,username,password,confPassword} = req.body
  var obj= new Users();
  return res.send(await obj.createUser(name,email,phone,username, password,confPassword))

})
// router.get("/login",async(req,res)=>{
  
// })

router.post("/login",async(req,res)=>{
  var username=req.body.username;
  var password = req.body.password;
  var obj= new Users();
  
  return res.send(await obj.loginUser(username,password))


})
// router.get("/profile",profile)
// router.get("/home",(req,res)=>{
//   res.redirect("categories")
// })
// router.get("/alreadyaccount",(req,res)=>{
//   res.redirect("login")
// })
// router.get("/logout",(req,res)=>{
//   res.redirect("home")
// })
router.post("/emailSend",async(req,res)=>{
  var email=req.body.email
  var obj= new Users();
  
          
  await verifyToken(req,res)
  //console.log(await verifyToken(req,res))
  return res.send(await obj.emailSend(email))

})
router.post("/otpcheck",async(req,res)=>{
  var otpCode=req.body.code
  var obj= new Users();
  return res.send(await obj.otpcheck(otpCode))

})
router.post("/changePassword",async(req,res)=>{
  var email=req.body.email
  var password=req.body.password
  var obj= new Users();
  return res.send(await obj.changePassword(email,password))

})

//router.get('/books', verifyToken,booksController.getAllBooks)
// router.get('/search', verifyToken,booksController.searchBook)
//router.post('/category', verifyToken,booksController.groupcat)
router.post("/nextbutton",async(req,res)=>{
  var username=req.body.username;
  var password = req.body.password;
  var obj= new Users();
  return res.send(await obj.loginUser(username,password))


})
 router.post("/selectPlan",async(req,res)=>{
  const{membershipPlan_id,transaction_id,validity}=req.body
  
  var obj= new membershipcont();
  return res.send(await obj.membership(membershipPlan_id,transaction_id,validity))


})

router.post("/bookclick",async(req,res)=>{
  var bookId=req.body.bookId;
  
  var obj= new membershipcont();
  return res.send(await obj.userBookList(bookId))
})
 router.post("/bookreturn",async(req,res)=>{
  var bookId=req.body.bookId;
  
  var obj= new membershipcont();
  return res.send(await obj.bookreturn(bookId))
})
var verifyToken =async (req,res,next) =>{
  try {
    let token = req.header('Authorization')
    console.log(token)
      
    
    if (!token) {
      res.send('Access Denied')
      //return "(status:'success,message:'Access Denied')";cd 

    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft()

    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    var userId = decoded.id
    //return userId
    
    //req.user = userId
    var data = await userData.findOne({ _id: userId })
    console.log(data.is_admin)
    if (data.is_admin == false)
    return "{'isAdmin':'false'}"
       
    else {
      return "{'isAdmin':'true'}"
      
    }
  next()
  } catch (err) {
     res.send(err)
    //return "{status:'fail',message: err.message }"
  }
}
mongoose.connect("mongodb://127.0.0.1:27017/userDetails").then(()=>{
  console.log("server started")
})
module.exports=router