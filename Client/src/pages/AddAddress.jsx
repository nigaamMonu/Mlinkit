import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import{ useAppContext} from '../context/AppContext'
import toast from 'react-hot-toast';

// input fields
const InputFields=(({type,placeholder,name,handleChange,address})=>{
  return (<input type={type}
    placeholder={placeholder} 
    name={name} 
    value={address[name]} 
    onChange={handleChange} 
    required
    className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-grey-500 focus:border-primary transition'
  />);
})

const AddAddress = () => {
  const {axios,user,navigate,setShowUserLogin} =useAppContext();

  const [address, setAddress]=useState({
    firstName: "",
    lastName: "",
    email:"",
    street: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone:"",
  });

  const handleChange=(e)=>{
    const {name,value}=e.target;

    setAddress((prevAddress)=>({
      ...prevAddress,[name]:value
    }))
  }

  const onSubmitHandler=async(e)=>{
    try{
      e.preventDefault();
      const {data} =await axios.post('/api/address/add',{address});
      if(data.success){
        toast.success(data.message);
        navigate('/cart');
      }else{
        toast.error(data.message);

      }
    }catch(err){
      toast.error(err.message);
    }


  }

  useEffect(()=>{
    if(!user){
      navigate('/cart');
      toast.error("Login first");
      setShowUserLogin(true);
    }
  },[])

  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-primary'>Address</span> </p>

      <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
        <div className='flex-1 max-w-md'>
         <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>

          <div className='grid grid-cols-2 gap-4'>
            <InputFields handleChange={handleChange} address={address} type={'text'} placeholder={'First Name'} name="firstName" />
            <InputFields handleChange={handleChange} address={address} type={'text'} placeholder={'Last Name'} name="lastName" />
          </div>
          <InputFields handleChange={handleChange} address={address} type={'email'} placeholder='email' name="email" />
          <InputFields handleChange={handleChange} address={address} type={'text'} placeholder='Street' name="street" />
          
          <div className='grid grid-cols-2 gap-4'>
          <InputFields handleChange={handleChange} address={address} type={'text'} placeholder='City' name="city" />
          <InputFields handleChange={handleChange} address={address} type={'text'} placeholder='State' name="state" />
          </div>

          <div className='grid grid-cols-2 gap-4'>
          <InputFields handleChange={handleChange} address={address} type={'Number'} placeholder='Zip Code' name="zipcode" />
          <InputFields handleChange={handleChange} address={address} type={'text'} placeholder='Country' name="country" />
          </div>
          
          <InputFields handleChange={handleChange} address={address} type={'text'} placeholder='Phone Number' name="phone" />


          <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>Save Address</button>

         </form>
        </div>
        <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add Address" />

      </div>
    </div>
  )
}

export default AddAddress
