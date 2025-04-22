import express from 'express';
import authSeller from '../middlewares/authSeller.js';
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js';




const sellerRouter=express.Router();

sellerRouter.get("/is-auth",authSeller,isSellerAuth);
sellerRouter.post("/login",sellerLogin);
sellerRouter.get("/logout",sellerLogout);



export default sellerRouter;
