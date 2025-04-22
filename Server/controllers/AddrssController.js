import Address from "../models/Address.js";

// add Address: /api/address/add

export const addAddress=async(req,res)=>{
  try{
    const {userId,address}=req.body;
    await Address.create({
      userId,
      ...address
    });
    res.json({success:true,message:"Address added successfully."});

  }catch(err){
    console.log(err.message);
    res.json({success:false,message:err.message});
  }
}


// get Address: /api/address/get

export const getAddrss=async(req,res)=>{
  try{
    const {userId}=req.body;
    const addresses=await Address.find({userId});

    res.json({success:true, addresses});
  }catch(err){
    console.log(err.message);
    res.json({success:false,message:err.message});
  }
}