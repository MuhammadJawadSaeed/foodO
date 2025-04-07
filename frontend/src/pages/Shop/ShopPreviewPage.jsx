import React from 'react'
import styles from '../../styles/styles'
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
const ShopPreviewPage = () => {
  return (
    <>
      <Header activeHeading={1} />
      <div className="w-full bg-[#fff]">
          <div className="w-full 800px:mt-12 800px:flex justify-between px-2">
            <div className="800px:w-[25%] bg-[#fff] rounded-[4px] 800px:border-r 800px:mb-20 800px:h-[110vh]">
              <ShopInfo isOwner={false} />
            </div>
            <div className="800px:w-[72%] mt-5 800px:mt-['unset'] rounded-[4px]">
              <ShopProfileData isOwner={false} />
            </div>
          </div>
      </div>
      <Footer />
    </>

  )
}

export default ShopPreviewPage