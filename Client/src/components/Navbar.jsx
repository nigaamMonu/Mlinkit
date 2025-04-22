import React, { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const {
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    getCartItemsCount,
    axios
  } = useAppContext();

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  const logout = async () => {
    try{
      const {data}= await axios.get('api/user/logout');
      if(data.success){
        toast.success(data.message);
        setUser(null);
        navigate('/');
      }else{
        toast.error(data.message);
      }
    }catch(err){
      toast.error(err.message);
    }
    
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9 object-contain mix-blend-multiply filter brightness-100 contrast-100" src={assets.logo} alt="dummyLogoColored" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Products</NavLink>
        <NavLink to="/">Contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img src={assets.cart_icon} alt="cart" className="w-6 opacity-80" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartItemsCount()}
          </button>
        </div>
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} alt="profile pic" className="w-10" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("my-orders")}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My order
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                logout
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-row items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img src={assets.cart_icon} alt="cart" className="w-6 opacity-80" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartItemsCount()}
          </button>
        </div>

        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className=""
        >
          {/* Menu Icon SVG */}
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white/90 backdrop-blur-md shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50 border-t border-gray-300 transition-all duration-300 ease-in-out`}
        >
          <NavLink to="/" onClick={() => setOpen(false)} className="cursor-pointer w-full text-center px-6 py-2 mt-2  hover:bg-blue-100 text-primary rounded-md transition text-sm">
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className="cursor-pointer w-full text-center px-6 py-2 mt-2 hover:bg-blue-100 text-primary rounded-md transition text-sm"
          >
            All Products
          </NavLink>
          {user && (
            <NavLink
              to="/my-orders"
              onClick={() => setOpen(false)}
              className="cursor-pointer w-full text-center px-6 py-2 mt-2  hover:bg-blue-100 text-primary rounded-md transition text-sm"
            >
              My order
            </NavLink>
          )}
          <NavLink to="/" onClick={() => setOpen(false)} className="cursor-pointer w-full text-center px-6 py-2 mt-2  hover:bg-blue-100 text-primary rounded-md transition text-sm">
            Contact
          </NavLink>

          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="cursor-pointer w-full text-center px-6 py-2 mt-2  hover:bg-blue-100 text-primary rounded-md transition text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
