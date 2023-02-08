const userData = require("../models/user.js")
const Otp = require("../models/otp.js")
const bcrypt = require("bcrypt");
var strings = require('node-strings');
//const { token } = require("morgan");
const jwt = require("jsonwebtoken");

const dotenv = require('dotenv');

// get config vars
dotenv.config();

class Users{
   async  createUser (name,
    email,
    phone,
    username,
    password,
    confPassword)  {
    

    try {
      const existingUser = await userData.findOne({ $or: [{ email }, { phone }] });
      if (!name || !email || !phone || !username || !password || !confPassword) {
        return "{ 'status': 'fail',' message': 'Please enter all fields' }";
      }

      if (password != confPassword) {
        return "{' status': 'fail', message: 'Passwords do not match' }";
      }

      if (password.length < 6) {
        return "{ status: 'fail', message: 'Password must be at least 6 characters' }";
      }

      if (existingUser)
        return "{ status: 'fail', message: 'Email or phone already registerd ' }";

      else {
        const hashPassword = await bcrypt.hash(password, 12);

        const result = await userData.create({
          name,
          phone,
          email,
          password: hashPassword,
          username,
          is_admin: false
        });

        await result.save();
        return "{ status: 'success',message: 'register successfully ,thank you!'}"


      }
    } catch (error) {
      console.log(error.message);
    }
  }
    async loginUser (username, password){
  
    
      try {
        const existingUser = await userData.findOne({ username :username});
  
        if (!existingUser)
          return "{ 'status': 'fail', 'message': 'user not found ' }";
  
        const isPasswordCorrect = await bcrypt.compare(
          password,
          existingUser.password
        );
  
        if (!isPasswordCorrect)
          return "{ 'status': 'fail',' message': 'incorrect password ' }";
        //console.log(existingUser._id)
        let payload = { "id": existingUser._id };
        let token = jwt.sign(payload, process.env.TOKEN_SECRET, { noTimestamp: true, expiresIn: '1h' });
  
        
        //res.cookie('cookie', token, { expires: new Date(Date.now() + 9999999) });
        return "{ 'status': 'success', 'message': 'login successfully' }";
  
      } catch (error) {
        console.log(error.message);
      }
    }
    async profile (req, res)  {
      try {
        const Users = await userData.find()
        return "{ status: 'success', message: Users}"
      } catch (error) {
        console.log(error)
      }
    }
  
    
    async emailSend (email)  {
      let data = await userData.findOne({ email: email })
  
      if (data) {
        let otpCode = Math.floor((Math.random() * (99999 - 10000) + 100000))
        let otpData = new Otp({
          email: email,
          code: otpCode,
          expireIn: new Date().getTime() + 300 * 1000
        })
  
        let otpRespone = await otpData.save()
        var otpResponeCode = otpRespone.code
        mailer(email, otpResponeCode)
        return "{ status: 'success', message: 'please check your email' }"
      }
      else {
        return "{ status: 'fail', message:  'email not exist' }"
      }
  
    }
    async otpcheck  (otpCode)  {
      
      let data = await Otp.find({ code: otpCode })
      //let data=await otp.findOne({code:otpCode})
      console.log(data)
  
      if (data && data.length > 0) {
        let currentTime = new Date().getTime()
        console.log(currentTime)
        let diff = data[0].expireIn - currentTime
        console.log(diff)
        if (diff < 0) {
          return "{  status: 'fail', message: 'token expire'}"
        } else {
          return "{ status: 'success', message: 'otp approved'}"
        }
      }
      else {
        return "{ status: 'fail', message: 'invalid otp'}"
      }
    }
    async changePassword(email,password)  {
      let user = await userData.findOne({ email:email })
      //console.log(user)
      const hashPassword = await bcrypt.hash(password, 12);
      user.password = hashPassword
      console.log(user.password)
      user.save()
      return "{ status: 'success', message: 'password changed successfully' }"
    }
  //    async verifyToken(token) {
  //     try {
        
        
  //       if (!token) {
  //         //res.send('Access Denied')
  //         return "(status:'success,message:'Access Denied')";
    
  //       }
  //       if (token.startsWith('Bearer ')) {
  //         token = token.slice(7, token.length).trimLeft()
    
  //       }
  //       const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  //       var userId = decoded.id
  //       //return userId
        
  //       //req.user = userId
  //       var data = await userData.findOne({ _id: userId })
  //       console.log(data.is_admin)
  //       if (data.is_admin == false)
  //       return "{'isAdmin':'false'}"
           
  //       else {
  //         return "{'isAdmin':'true'}"
          
  //       }
  //     next()
  //     } catch (err) {
  //        res.send(err)
  //       return "{status:'fail',message: err.message }"
  //     }
  //   }
  // }
  
  
  // const mailer = (email, otp) => {
  //   var nodemailer = require('nodemailer')
  //   //   console.log(otp)
  //   //  var otpResponeCode=strings.bold(otp)
  //   //  console.log(otpResponeCode)
  //   var transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: 'ayishasifna@gmail.com',
  //       pass: 'kvthkbvgfnzpyywe'
  //     }
  //   })
  //   var mailOptions = {
  //     from: 'ayishasifna@gmail.com',
  //     to: "fathimathasneem3621@gmail.com",
  //     subject: otp + "otp verification",
  //     html: "<h3>Hi! Here is your single use verification code for:</h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" +
  //       "<p>Be quick! it expire soon</p>"
  //   }
  //   transporter.sendMail(mailOptions, (err, info) => {
  //     if (err) {
  //       console.log(err)
  //     } else {
  //       console.log("Email sent:" + info.response)
  //     }
  //   })
  }
  
  
    
  
  module.exports=Users