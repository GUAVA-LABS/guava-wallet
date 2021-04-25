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
          active={selectedKey === "news"}
          onClick={() => handleClick("/news")}
        >
          <SnippetsFilled />
          News
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
