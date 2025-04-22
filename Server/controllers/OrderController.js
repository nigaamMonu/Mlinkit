import Order from "../models/order.js";
import Product from "../models/product.js";
import stripe from "stripe";
import User from "../models/user.js"



// Place ordre cod : /api/order/cod
export const placeOrderCOD=async(req,res)=>{
  try{
    const {userId, items, address}=req.body;
   
    if(!address || items.length===0) {
      return res.json({success:false,message:"Invalid data"});
    }
    
    // calculating amount using items
    let amount=await items.reduce(async(acc, item)=>{
      const product=await Product.findById(item.product);
      const productCount=item.quantity;

      return await(acc)+product.offerPrice * productCount;
    },0)

    // tax

    amount+=Math.floor(amount * 0.02);

    await Order.create({
      userId,
      address,
      items,
      amount,
      paymentType:"COD"
    })

    res.json({success:true, message:"Order placed Successfully."})

  }catch(err){
    console.log(err.message);
    res.json({success:false,message:err.message});
  }
}


// Place ordre stripe : /api/order/stripe
export const placeOrderStripe = async(req,res)=>{
  try{
    const {userId, items, address}=req.body;

    const { origin }=req.headers;
   
    if(!address || items.length===0) {
      return res.json({success:false,message:"Invalid data"});
    }

    let productData = [];
    
    // calculating amount using items
    let amount=await items.reduce(async(acc, item)=>{
      const product=await Product.findById(item.product);
      productData.push({
        name:product.name,
        price:product.offerPrice,
        quantity:item.quantity,
      });
      const productCount=item.quantity;

      return await(acc)+product.offerPrice * productCount;
    },0)
    // tax

    amount+=Math.floor(amount * 0.02);

    const order= await Order.create({
      userId,
      address,
      items,
      amount,
      paymentType:"Online"
    })



    // stripe gateway initialize

    const stripeInstance =new stripe(process.env.STRIPE_SECRET_KEY);

    // create line item fro stripe

    const line_items=productData.map((item)=>{
      return {
        price_data:{
          currency:"inr",
          product_data:{
            name:item.name,
          },
          unit_amount: Math.floor(item.price +item.price * 0.02)*100
        },
        quantity : item.quantity,
      }
    })

    // create session
    const session =await stripeInstance.checkout.sessions.create({
      line_items,
      mode:"payment",
      success_url:`${origin}/loader?next=my-orders`,
      cancel_url:`${origin}/cart`,
      metadata:{
        orderId:order._id.toString(),
        userId,
      }
    })

    return res.json({success:true, url:session.url})

  }catch(err){
    console.log(err.message);
    res.json({success:false,message:err.message});
  }
}


// Stripe webhooks to verify payments action

export const stripeWebhooks =async(req,res)=>{
  // Stripe gateway initialize

  const stripeInstance= new stripe(process.env.STRIPE_SECRET_KEY);
  const sig=req.headers["stripe-signature"];
  let event;

  try{
    event =stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  }catch(err){
    res.status(400).send(`Webhook Error: ${err.message}`)
  }


  // handle the events
  switch(event.type){
    case "payment_intent.succeeded":{
      const paymentIntent=event.data.object;
      const paymentIntentId=paymentIntent.id;

      // Getting session metadata
      const session =await stripeInstance.checkout.sessions.list({
        payment_intent:paymentIntentId,
      });
      const {orderId, userId} =session.data[0].metadata;

      // Mark payment as paid 
      await Order.findByIdAndUpdate(orderId,{isPaid:true});

      // clear cart data
      await User.findByIdAndUpdate(userId,{cartItems:{}});
      break;
    }

    case "payment_intent.payment_failed" :{
      const paymentIntent=event.data.object;
      const paymentIntentId=paymentIntent.id;

      // Getting session metadata
      const session =await stripeInstance.checkout.sessions.list({
        payment_intent:paymentIntentId,
      });
      const {orderId} =session.data[0].metadata;

      await Order.findByIdAndDelete(orderId);
      break;

    }
    default:
      console.error(`Unhandled event type ${event.type}`);
      break;
  }

  res.json({received:true});
}



// get ordes by userId : /api/order/user

export const getUserOrders=async(req,res)=>{
  try{
    const {userId}= req.body;

    const orders=await Order.find({
      userId,
      $or: [{paymentType: "COD"}, {isPaid:true}]
    }).populate("items.product address").sort({createdAt:-1});
    res.json({success:true,orders});

  }catch(err){
    res.json({success:false,message:err.message});
  }
}



// get all orders for seller : /api/order/seller

export const getAllOrders=async(req,res)=>{
  try{
    const orders=await Order.find({
      $or:[{paymentType:"COD"},{isPaid:true}]
    }).populate('items.product address').sort({createdAt:-1});

    res.json({success:true,orders});
  }catch(err){
    res.json({success:false,message:err.message});
  }
}