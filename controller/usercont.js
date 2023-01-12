const userData = require("../models/user.js")
const Otp= require("../models/otp.js")
const bcrypt = require("bcrypt");

const { token } = require("morgan");



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
        username
      });
  
      // const token = jwt.sign(
      //   { email: result.email, id: result._id, userName: result.username },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "2h" }
      // );
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
  
      // const token = jwt.sign(
      //   {
      //     email: existingUser.email,
      //     id: existingUser._id,
      //     userName: existingUser.userName,
      //   },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "2h" }
      // );
  
      res.json({status : "success", message:"login successfully" });
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
    mailer(req.body.email,otpRespone.code)
    res.json({status : "success",message:"please check your email"})}
    else{
      res.json({status : "fail",message:"email not exist"})
    }
  },
  changePassword:async (req, res) => {
    email=req.body.email
    otpCode=req.body.code
    console.log(otpCode)
    let data=await Otp.find({email:email,code:otpCode})
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
        let user=await userData.findOne({email:req.body.email})
        //console.log(user)
        const hashPassword = await bcrypt.hash(req.body.password, 12);
        user.password=hashPassword
        console.log(user.password)
        user.save()
        res.json({status : "success",message:"password changed successfully"})
      }
    }
    else{
      res.json({status : "fail",message:"invalid otp"})
    }
    }}
   
    const mailer=(email,otp)=>{
      var nodemailer=require('nodemailer')
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
        subject:"otp verification",
        text:otp
      }
      transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
          console.log(err)
        }else{
          console.log("Email sent:"+info.response)
        }
      })
    }
  