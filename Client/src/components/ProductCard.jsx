import React from 'react';
import { useAppContext } from '../context/AppContext';

import{ assets }from '../assets/assets';
const ProductCard = ({product}) => {
  const { cartItems, addToCart, removeFromCart, navigate } = useAppContext();

  return product && (
    <div onClick={()=>{navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    scrollTo(0,0);
  }} className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white 
                    flex flex-col overflow-hidden
                    transform hover:-translate-y-1 hover:scale-[1.02]
                    border border-gray-500/10 max-w-xs">
      <div className="group cursor-pointer p-3 flex items-center justify-center h-40">
        <img 
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300" 
          src={product.image[0]} 
          alt={product.name} 
        />
      </div>
      
      <div className="p-3 flex flex-col gap-1.5 flex-grow">
        <span className="text-xs text-gray-500/80">{product.category}</span>
        <h3 className="text-gray-800 font-medium text-base line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1">
          {Array(5).fill('').map((_, i) => (
            <img 
              key={i} 
              src={i < 3 ? assets.star_icon : assets.star_dull_icon} 
              alt="" 
              className="w-3.5 h-3.5"
            />
          ))}
          <span className="text-xs text-gray-500/80">(3)</span>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-semibold text-primary">
              Rs{product.offerPrice}
            </span>
            <span className="text-xs text-gray-500/60 line-through">
              Rs{product.price}
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="text-primary">
            {!cartItems[product._id] ? (
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20
                          border border-primary/20 rounded-full transition-colors
                          text-primary text-sm font-medium"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} alt="cart" className="w-4 h-4 opacity-80" />
                Add
              </button>
            ) : (
              <div className="flex items-center bg-primary/10 rounded-full">
                <button 
                  onClick={() => removeFromCart(product._id)}
                  className="px-3 py-1.5 text-primary hover:bg-primary/20 rounded-l-full transition-colors"
                >
                  -
                </button>
                <span className="w-6 text-center text-primary text-sm font-medium">
                  {cartItems[product._id]}
                </span>
                <button 
                  onClick={() => addToCart(product._id)}
                  className="px-3 py-1.5 text-primary hover:bg-primary/20 rounded-r-full transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;