const userData = require("../models/user.js")
const Otp= require("../models/otp.js")
const bcrypt = require("bcrypt");
const otp = require("../models/otp.js");
const { token } = require("morgan");
const User = require("../models/user.js");

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
        return res.status(400).json({ message: 'Please enter all fields' });
      }
    
      if (password != confPassword) {
        return res.status(400).json({message: 'Passwords do not match' });
      }
    
      if (password.length < 6) {
        return res.status(400).json({message:'Password must be at least 6 characters' });
      }
  
      if (existingUser)
        return res.status(400).json({ message: "Email or phone already registerd " });
      
      else{
      const hashPassword = await bcrypt.hash(password, 12);
  
      const result = await userData.create({
        name,
        phone,
        email,
        password: hashPassword,
        username
      });
  
      // const token = jwt.sign(
      //   { email: result.email, id: result._id, userName: result.username },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "2h" }
      // );
      await result.save();
      res.status(200).json({message:"successfully registered..thank you!" });
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
        return res.status(400).json({ message: "user not found " });
  
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
  
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "incorrect password " });
  
      // const token = jwt.sign(
      //   {
      //     email: existingUser.email,
      //     id: existingUser._id,
      //     userName: existingUser.userName,
      //   },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "2h" }
      // );
  
      res.status(200).json({ message:"login successfully" });
    } catch (error) {
      console.log(error.message);
    }
  },
  emailSend :async (req, res) => {
    let data=await userData.findOne({email:req.body.email})
    const response={}
    if(data){
      let otpCode=Math.floor((Math.random()*1000+1))
      let otpData=new Otp({email:req.body.email,
      code:otpCode,
      expireIn:new Date().getTime()+300*1000})
    
    let otpRespone=await otpData.save()
    res.status(200).json("please check your email")}
    else{
      res.status(404).json("email not exist")
    }
  },
  changePassword:async (req, res) => {
    let data=await otp.find({email:req.body.email,code:req.body.otpCode})
    console.log(data)
    if(data){
      let currentTime=new Date().getTime()
      let diff=data.expireIn-currentTime
      if(diff<0){
        res.status(404).json({message:"token expire"})
      }else{
        let user=await userData.findOne({email:req.body.email})
        user.password=req.body.password
        user.save()
        res.status(200).json({message:"password changed successfully"})
      }
    }
    else{
      res.status(404).json("invalid otp")
    }
    }}
   
    const mailer=(email,otp)=>{
      var nodemailer=require('nodemailer')
      var transporter=nodemailer.createTransport({
        service:'gmail',
        port:587,
        secure:false,
        auth:{
          user:'code@gmail.com',
          pass:'123'
        }
      })
      var mailOptions={
        from:'code@gmail.com',
        to:"ayishasifna@gmail.com",
        subject:"otp verification",
        text:"thank"
      }
      transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
          console.log(err)
        }else{
          console.log("Email sent:"+info.response)
        }
      })
    }
  