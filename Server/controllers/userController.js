import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register user: /api/user/register

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true, // prvent client-side JS from accessing the token
      secure: process.env.NODE_ENV === "production", // only send the cookie over HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // secure from CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: "Internal server error" });
  }
};

// login user: /api/user/login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Please register youself" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token= jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return res.json({success:true,user:{email:user.email,name:user.name}})
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: "Internal server error" });
  }
};
 

// check auth: /api/user/is-auth

export const isAuth = async (req, res) => {
  try{
    const userId =req.body.userId;
    const user=await User.findById(userId).select("-password");

    return res.status(200).json({success:true,user});


  }catch(error){
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
}

// logout user: /api/user/logut

export const logout=async(req,res)=>{
  try{
    res.clearCookie('token',{
      httpOnly:true,
      secure:process.env.NODE_ENV ==='production',
      sameSite:process.env.NODE_ENV ==='production' ? 'none' :'strict',
    })

    return res.json({success:true,message:"Logged out"});
  }catch(error){
    console.log(error.message);
    res.json({success:false,message:error.message});
  }
}
