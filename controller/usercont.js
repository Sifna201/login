const userData = require("../models/user.js")
const Otp= require("../models/otp.js")
const bcrypt = require("bcrypt");
var strings = require('node-strings');
const { token } = require("morgan");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const dotenv = require('dotenv');

// get config vars
dotenv.config();


module.exports={ createUser :async (req, res) => {
    const { name,
        email,
        phone,
        username ,
        password,
        confPassword,
    }  = req.body;
  
    try {
      const existingUser = await userData.findOne({$or:[{ email },{phone}]});
      if (!name || !email ||!phone|| !username||!password || !confPassword) {
        return res.json({status : "fail" ,message: 'Please enter all fields' });
      }
    
      if (password != confPassword) {
        return res.json({status : "fail",message: 'Passwords do not match' });
      }
    
      if (password.length < 6) {
        return res.json({status : "fail",message:'Password must be at least 6 characters' });
      }
  
      if (existingUser)
        return res.json({status : "fail", message: "Email or phone already registerd " });
      
      else{
      const hashPassword = await bcrypt.hash(password, 12);
  
      const result = await userData.create({
        name,
        phone,
        email,
        password: hashPassword,
        username,
        is_admin:false
      });
     
      await result.save();
      res.json({
        status : "success",
        message: "register successfully ,thank you!" })
         
    
    } }catch (error) {
      console.log(error.message);
    }
}, 
profile:async (req,res)=>{
  try {
    const Users = await userData.find()
    res.status(200).send(Users)
} catch (error) {
    console.log(error)
}
},
  
   loginUser:async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await userData.findOne({ username });
  
      if (!existingUser)
        return res.json({status : "fail", message: "user not found " });
  
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
  
      if (!isPasswordCorrect)
        return res.json({status : "fail", message: "incorrect password " });
  
        
      
      const token = jwt.sign(
        { userName: req.body.username },
        process.env.TOKEN_SECRET,
        { expiresIn: "2h" }
      );
      res.cookie('cookie', token, {expires: new Date(Date.now() + 9999999)});
      res.json({status : "success", message:"login successfully" });
    
    } catch (error) {
      console.log(error.message);
    }
  },
  emailSend :async (req, res) => {
    let data=await userData.findOne({email:req.body.email})
    
    if(data){
      let otpCode=Math.floor((Math.random()*(99999-10000)+100000))
      let otpData=new Otp({email:req.body.email,
      code:otpCode,
      expireIn:new Date().getTime()+300*1000})
    
    let otpRespone=await otpData.save()
    var otpResponeCode=otpRespone.code
    mailer(req.body.email,otpResponeCode)
    res.json({status : "success",message:"please check your email"})}
    else{
      res.json({status : "fail",message:"email not exist"})
    }
    authenticateToken()
  },
  otpcheck:async (req, res) => {
    otpCode=req.body.code
    let data=await Otp.find({code:otpCode})
    //let data=await otp.findOne({code:otpCode})
    console.log(data)
   
    if(data && data.length>0){
      let currentTime=new Date().getTime()
      console.log(currentTime)
      let diff=data[0].expireIn-currentTime
      console.log(diff)
      if(diff<0){
        res.json({status : "fail",message:"token expire"})
      }else{
        res.json({status : "success",message:"otp approved"})}
    }   
    else{
      res.json({status : "fail",message:"invalid otp"})
    }
    },
    changePassword:async (req, res) => {
    let user=await userData.findOne({email:req.body.email})
    //console.log(user)
    const hashPassword = await bcrypt.hash(req.body.password, 12);
    user.password=hashPassword
    console.log(user.password)
    user.save()
    res.json({status : "success",message:"password changed successfully"})
    }}
   function authenticateToken(req, res, next) {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
    
      if (token == null) return res.sendStatus(401)
    
      jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
        
        if (err) return res.sendStatus(403)
    
        req.user = user
        console.log(user)
    
        next()
      })
    }


    const mailer=(email,otp)=>{
      var nodemailer=require('nodemailer')
    //   console.log(otp)
    //  var otpResponeCode=strings.bold(otp)
    //  console.log(otpResponeCode)
      var transporter=nodemailer.createTransport({
        service:'gmail',
        port:587,
        secure:false,
        auth:{
          user:'ayishasifna@gmail.com',
          pass:'kvthkbvgfnzpyywe'
        }
      })
      var mailOptions={
        from:'ayishasifna@gmail.com',
        to:"fathimathasneem3621@gmail.com",
        subject:otp+"otp verification",
        html:"<h3>Hi! Here is your single use verification code for:</h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"+
        "<p>Be quick! it expire soon</p>"
      }
      transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
          console.log(err)
        }else{
          console.log("Email sent:"+info.response)
        }
      })
    }

    