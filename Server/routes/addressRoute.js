import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addAddress, getAddrss } from '../controllers/AddrssController.js';

const addressRouter=express.Router();

addressRouter.post("/add",authUser,addAddress);
addressRouter.get("/get",authUser,getAddrss);



export default addressRouter;