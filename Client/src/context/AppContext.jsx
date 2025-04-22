import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';


axios.defaults.withCredentials=true;  // to send cookies to api
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const AppContext = createContext();

export const AppContextProvider=({ children }) => {

  const currency=import.meta.VITE_CURRENCY;

  const navigate= useNavigate();
  const [user,setUser]= useState(null);
  const [isSeller, setIsSeller]= useState(false);
  const [showUserLogin, setShowUserLogin] =useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems,setCartItems]=useState({});
  const [searchQuery,setSearchQuery]=useState("");
  // const [isLoading, setIsLoading] = useState(true);



  const fetchSeller =async ()=>{
    try{
      const {data}= await axios.get('/api/seller/is-auth');

      if(data.success){
        setIsSeller(true);
      }else{
        setIsSeller(false);
      }
    }catch(err){
      setIsSeller(false);
    }
  }


  // fetch user Auth status, user Data and CartItems

  const fetchUser=async()=>{
    try{
      const {data}=await axios.get('api/user/is-auth');
      if(data.success){
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    }catch(err){
      setUser(null);
    }
  }


  const fetchProducts=async()=>{
     try{
      const {data}= await axios.get("/api/product/list");
      if(data.success){
        setProducts(data.products);
      }else{
        toast.error(data.message);
      }
     }catch(err){
      toast.error(err.message);
     }
  }



  // Add Product to cart
  const addToCart=(itemId)=>{
    let cartData=structuredClone(cartItems);
    if(cartData[itemId]){
      cartData[itemId]+=1;
    }else {
      cartData[itemId]=1;
    }


    setCartItems(cartData);
    toast.success("Added to cart.")
  }

  // update cart item quantity
  const updateCartItem=(itemId,quantity)=>{
    let cartData=structuredClone(cartItems);
    cartData[itemId]=quantity;
    setCartItems(cartData);
    toast.success("Cart updated.");
  }

  // Remove product from cart
  const removeFromCart=(itemId)=>{
    let cartData=structuredClone(cartItems);
    if(cartData[itemId]){
      cartData[itemId]-=1;
      if(cartData[itemId]<=0){
        delete cartData[itemId];
      }
    }
    toast.success("Removed successfully.");
    setCartItems(cartData);
  }

  // get cart items count
  const getCartItemsCount=()=>{
    let count=0;
    for(let i in cartItems){
      count+=cartItems[i];
    }
    return count;
  }

  // get cart items total price
  const getCartAmount=()=>{
    let total=0;
    for(let i in cartItems){
      let product=products.find((item)=>item._id===i);
      if(product){
        total+=product.offerPrice*cartItems[i];
      }
    }
    return total;
  }


  useEffect(()=>{
    fetchSeller();
    fetchProducts();
    fetchUser();
    
  },[])

  // updata databse cart items
  useEffect(()=>{
    const updateCart=async ()=>{
      try{
        const {data} =await axios.post('/api/cart/update',{cartItems});
        if(!data.success){
          toast.error(data.message);
        }
      }catch(err){
        toast.error(err.message);
      }

     
    }
    if(user){
      updateCart();
    }
  },[cartItems]);

  const value = {
    axios,
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    getCartItemsCount,
    getCartAmount,
    fetchProducts
  }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
  return useContext(AppContext);
}