var express = require('express');
var router = express.Router();
const multer=require('multer')
var  path = require("path")
var mongoose = require("mongoose")
const bodyParser = require("body-parser") 
const {createUser,profile, loginUser,emailSend,changePassword} = require("../controller/usercont.js");
const booksController=require("../controller/books-controller")
const uplodPath = path.join('../public/images')
const imageTypes = ['images/jpeg', 'images/png',]
const upload = multer({ dest: 'uploads/' })

router.get("/getstarted",(req,res)=>{
res.render("register page")
})
router.get("/signin",(req,res)=>{
  res.render("loginpage")
})
router.get("/register",(req,res)=>{
res.redirect("login page")})
router.post("/register",createUser)
router.get("/login",(req,res)=>{
  res.render("categories")})
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
router.post("/changePassword",changePassword)

router.get('/books', booksController.getAllBooks)
router.get('/search', booksController.searchBook)
router.post('/books', booksController.addBook)
router.put('/:id', booksController.updateBook)
router.delete('/:id', booksController.deleteBook)

// mongoose
mongoose.connect("mongodb://127.0.0.1:27017/userDetails").then(()=>{
    
        console.log("Server started ")

    })


module.exports = router;
