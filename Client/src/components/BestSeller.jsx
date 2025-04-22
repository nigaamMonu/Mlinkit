import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  

  const {products}=useAppContext();



  // if (isLoading) {
  //   return (
  //     <div className="mt-16">
  //       <p className="text-2xl md:text-3xl font-medium">Best Seller</p>
  //       <div className="mt-6">Loading products...</div>
  //     </div>
  //   );
  // }


  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Seller</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
        {products.filter((product)=> product.inStock).slice(0,5).map((product, index) => {
         return ( <ProductCard key={index} product={product} />)
        })}
        

      </div>
    </div>
  );
};

export default BestSeller;
