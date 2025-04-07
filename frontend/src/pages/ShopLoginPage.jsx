import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopLogin from "../components/Shop/ShopLogin";
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller,isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if(isSeller === true){
      navigate(`/dashboard`);
    }
  }, [isLoading,isSeller])
  return (
    <div>
      <Header />
      <ShopLogin />
      <Footer />
    </div>
  )
}

export default ShopLoginPage