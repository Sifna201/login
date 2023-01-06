var express = require('express');
var router = express.Router();

var  path = require("path")
var mongoose = require("mongoose")
const bodyParser = require("body-parser") 
const {createUser, loginUser} = require("../controller/usercont.js")

router.post("/reg",createUser)
router.post("/login",loginUser)
router.get("/alreadyaccount",(req,res)=>{
  res.redirect("login")
})
// mongoose
mongoose.connect("mongodb://127.0.0.1:27017/userDetails").then(()=>{
    
        console.log("Server started ")

    })


module.exports = router;
