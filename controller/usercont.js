const userData = require("../models/user.js")
const bcrypt = require("bcrypt")
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
  
      res.status(200).json({ result: existingUser });
    } catch (error) {
      console.log(error.message);
    }
  }}