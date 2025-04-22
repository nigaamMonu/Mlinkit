import React from 'react'
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {

  const {products} = useAppContext();
  const {category}=useParams();

  const searchCategory=categories.find((item)=>item.path.toLowerCase()===category.toLowerCase());
  const filteredProducts=products.filter((product)=>product.category.toLowerCase()===category.toLowerCase());


  return (
    <div className='mt-16'>
      {searchCategory && (
        <div className='flex flex-col items-end w-max'>
          <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
          <div className='w-32 h-0.5 bg-primary rounded-full'></div>
        </div>
      )}
      {filteredProducts.length>0 ? (
        <div>
          {/* Add content for when products are found */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8'>
            {filteredProducts.filter((product)=>product.inStock).map((product,index)=>{
              return (
                <ProductCard key={product._id} product={product} />
              )
            })}
          </div>  
         
        </div>
      ) : (
        <div className='flex items-center justify-center h-[60vh] text-xl font-semibold'>
          {/* Add content for when no products are found */}
          No products found.
        </div>
      )}
    </div>
  )
}

export default ProductCategory;
