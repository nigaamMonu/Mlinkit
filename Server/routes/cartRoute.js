import express from 'express';
import { upadateCart } from '../controllers/cartController.js';
import authUser from '../middlewares/authUser.js';



const cartRouter=express.Router();

cartRouter.post('/update',authUser, upadateCart);



export default cartRouter;