var express = require('express');
var router = express.Router();
const multer=require('multer')
var  path = require("path")
var mongoose = require("mongoose")
const bodyParser = require("body-parser") 
const {createUser,profile, loginUser,emailSend,otpcheck,changePassword,authenticateToken} = require("../controller/usercont.js");
const booksController=require("../controller/books-controller");
const { membership, transaction,bookreturn,userBookList } = require('../controller/membershipcont.js');
const uplodPath = path.join('../public/images')
const imageTypes = ['images/jpeg', 'images/png',]
const upload = multer({ dest: 'uploads/' })
const userData = require("../models/user.js")

router.get("/getstarted",(req,res)=>{
res.render("register page")
})
router.get("/signin",(req,res)=>{
  res.render("loginpage")
})
router.get("/register",(req,res)=>{
res.redirect("login page")})
router.post("/register",createUser)
router.get("/login",async(req,res)=>{
  var data=await userData.findOne({username:req.body.username})
  console.log(data.is_admin)
  if(data.is_admin==false)
  res.send("categories user")
else{
  res.send("categories admin")
}})
router.post("/login",loginUser)
router.get("/profile",profile)
router.get("/home",(req,res)=>{
  res.redirect("categories")
})
router.get("/alreadyaccount",(req,res)=>{
  res.redirect("login")
})
router.get("/logout",(req,res)=>{
  res.redirect("home")
})
router.post("/emailSend",emailSend)
router.post("/otpcheck",otpcheck)
router.post("/changePassword",changePassword)

router.get('/books', booksController.getAllBooks)
router.get('/search', booksController.searchBook)
router.post('/category', booksController.groupcat)
router.post("/nextbutton",loginUser)
router.post("/selectPlan",membership)

//router.post("/bookclick",userBookList,authenticateToken)
router.post("/bookreturn",bookreturn)  
mongoose.connect("mongodb://127.0.0.1:27017/userDetails").then(()=>{
  console.log("server started")
})
module.exports=router