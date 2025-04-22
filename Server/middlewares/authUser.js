import jwt from "jsonwebtoken";

const authUser=async(req, res, next) => {
 
    const token=req.cookies.token;
    if(!token){
      return res.status(401).json({success:false,message:"Not authorized."});
    }
  try{ 
    const tokenDecoded=jwt.verify(token,process.env.JWT_SECRET);
    req.body = req.body || {};
    
    if(tokenDecoded){
      req.body.userId=tokenDecoded.id;
    }else{
      return res.status(402).json({success:false,message:"Not authorized."});
    }

    next();


  }catch(error){
    console.log(error.message); 
    res.status(500).json({success:false,message:"Internal server error"})
  }
}


export default authUser;