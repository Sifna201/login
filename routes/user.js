var express = require('express');
var router = express.Router();
const multer=require('multer')
var  path = require("path")
var mongoose = require("mongoose")
const bodyParser = require("body-parser") 

const booksController=require("../controller/books-controller");
const { membership, transaction,bookreturn,userBookList } = require('../controller/membershipcont.js');
const uplodPath = path.join('../public/images')
const imageTypes = ['images/jpeg', 'images/png',]
const upload = multer({ dest: 'uploads/' })
const userData = require("../models/user.js");
const Users = require('../controller/usercontroller.js');
// router.get("/getstarted",(req,res)=>{
// res.render("register page")
// })
// router.get("/signin",(req,res)=>{
//   res.render("loginpage")
// })
// router.get("/register",(req,res)=>{
// res.redirect("login page")})
// //router.post("/register",createUser)
// router.get("/login",async(req,res)=>{
  
// })

router.post("/login",async(req,res)=>{
  var username=req.body.username;
  var password = req.body.password;
  var obj= new Users();
  obj.loginUser(username,password)


})
//router.get("/profile",profile)
router.get("/home",(req,res)=>{
  res.redirect("categories")
})
router.get("/alreadyaccount",(req,res)=>{
  res.redirect("login")
})
router.get("/logout",(req,res)=>{
  res.redirect("home")
})
// router.post("/emailSend",async(req,res)=>{
//   var email=req.body.email
//   var obj= new Users();
//   obj.emailSend()

// })
// router.post("/otpcheck",verifyToken,otpcheck)
// router.post("/changePassword",verifyToken,changePassword)

// router.get('/books', verifyToken,booksController.getAllBooks)
// router.get('/search', verifyToken,booksController.searchBook)
// router.post('/category', verifyToken,booksController.groupcat)
// router.post("/nextbutton",verifyToken,loginUser)
// router.post("/selectPlan",verifyToken,membership)

// router.post("/bookclick",verifyToken,userBookList)
// router.post("/bookreturn",verifyToken,bookreturn)  

var verifyToken =async (token) =>{
  try {
    console.log(token)
    if (!token) {
      return res.status(403).send("Access Denied");

    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft()

    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    var userId = decoded.id
    
    //req.user = userId
    var data = await userData.findOne({ _id: userId })
    console.log(data.is_admin)
    if (data.is_admin == false)
    //return {"id":1,"isAdmin":false}
       console.log("user")
    else {
      console.log("admin")
    }
    return userId
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
mongoose.connect("mongodb://127.0.0.1:27017/userDetails").then(()=>{
  console.log("server started")
})
module.exports=router