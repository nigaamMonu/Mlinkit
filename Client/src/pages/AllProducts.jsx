import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';

const AllProducts = () => {

  const {products,searchQuery} = useAppContext();
  const [filteredProducts, setFilteredProducts] =useState([]);

  useEffect(()=>{
    if(searchQuery.length>0){
      const filtered = products.filter((product) => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }else{
      setFilteredProducts(products);
    }
  },[products,searchQuery]);



  return (
    <div className='mt-16 flex flex-col'>
      <h1 className='text-3xl font-semibold uppercase'>All Products</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8'>
        {filteredProducts.filter((product)=>product.inStock).map((product,index)=>{
          return (
            <ProductCard key={product._id} product={product} />
          )
        })}
      </div>
      <div className='flex justify-center mt-8'>
        <button className='bg-primary text-white py-2 px-4 rounded-md'>Load More</button> 
      </div>
      
    </div>
  )
}

export default AllProducts;
