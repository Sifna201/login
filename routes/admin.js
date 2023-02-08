var express = require('express');
var router = express.Router();
const multer=require('multer')
var  path = require("path")
var mongoose = require("mongoose")
const bodyParser = require("body-parser") 

const uplodPath = path.join('../public/images')
const imageTypes = ['images/jpeg', 'images/png',]
const upload = multer({ dest: 'uploads/' })
const Bookscont=require("../controller/books-controller");
const  membershipcont = require('../controller/membershipcont.js');
const Users = require('../controller/usercontroller.js');

router.post('/add',async(req,res)=>{
    const { name, author, description, image, category } = req.body
    var obj=new Bookscont()
    return res.send(await obj.addBook(name, author, description, image, category))
})

router.delete('/:id', async(req,res)=>{
    
    var obj=new Bookscont()
    return res.send(await obj.deleteBookBook())
})
//router.post('/category',verifyToken ,booksController.groupcat)



mongoose.connect("mongodb://127.0.0.1:27017/userDetails").then(()=>{
  console.log("server started")
})
module.exports=router


