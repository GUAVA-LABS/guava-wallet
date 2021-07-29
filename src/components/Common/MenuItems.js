import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import {
  FolderOpenFilled,
  CaretRightOutlined,
  SettingFilled,
  ShopFilled,
  SnippetsFilled,
} from "@ant-design/icons";
import {IoLogoGameControllerB} from 'react-icons/io'
import gameIcon from '../../assets/game-icon.svg'
// import { ReactComponent as YourSvg } from './your-svg.svg';

import { Footer, NavButton } from "@components/App.js";
// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
export default ({ selectedKey, currentPage, handleClick }) => (
  <Footer>
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      navigation
      
    >
      
        <NavButton
          active={selectedKey === "wallet"}
          onClick={() => handleClick("/wallet")}
        >
          <FolderOpenFilled />
          Wallet
        </NavButton>

        <NavButton
          active={selectedKey === "send"}
          onClick={() => handleClick("/send")}
        >
          <CaretRightOutlined />
          Send
        </NavButton>
        <NavButton
          active={selectedKey === "games"}
          onClick={() => handleClick("/games")}
        >
          <div style={{display:'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: '6px'}}>
          <IoLogoGameControllerB style={{fontSize: '30px'}}/>

          </div> 
          Games
        </NavButton>

        <NavButton
          active={selectedKey === "configure"}
          onClick={() => handleClick("/configure")}
        >
          <SettingFilled />
          Settings
        </NavButton>
      
    </Swiper>
  </Footer>
);


