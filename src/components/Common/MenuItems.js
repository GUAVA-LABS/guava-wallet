import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/swiper-bundle.css";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import {
    FolderOpenFilled,
    CaretRightOutlined,
    SettingFilled,
    ShopFilled,
    SnippetsFilled
} from '@ant-design/icons';
import { Footer, NavButton } from '@components/App.js'
// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
export default ({ selectedKey, currentPage, handleClick }) => (
    <Footer>
    <Swiper spaceBetween={0}
  slidesPerView={1}
  onSwiper={(swiper) => console.log(swiper)}
  onSlideChange={() => console.log('slide change')}
  navigation
      >
        
        <SwiperSlide  key={0}>
            <NavButton
                active={selectedKey === 'wallet'}
                onClick={() => handleClick('/wallet')}
            >
                <FolderOpenFilled />Wallet</NavButton>


            <NavButton
                active={selectedKey === 'send'}
                onClick={() => handleClick('/send')}
            >
                <CaretRightOutlined />Send</NavButton>
                <NavButton
                active={selectedKey === 'market'}
                onClick={() => handleClick('/market')}
            >
                <ShopFilled />
                Market
                            </NavButton>
          
            
        </SwiperSlide>
        <SwiperSlide isVisible={currentPage === 1} key={1}>
        
            <NavButton
                active={selectedKey === 'news'}
                onClick={() => handleClick('/news')}
            >
                <SnippetsFilled />News</NavButton>

            <NavButton
                active={selectedKey === 'configure'}
                onClick={() => handleClick('/configure')}
            >
                <SettingFilled />Settings</NavButton>
   
        </SwiperSlide>
    </Swiper>
</Footer>
    
);
