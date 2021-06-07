import React, { useState } from "react";
import styled from "styled-components";
import RawQRCode from "qrcode.react";
import { currency } from "@components/Common/Ticker.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Event } from "@utils/GoogleAnalytics";

export const StyledRawQRCode = styled(RawQRCode)`
  cursor: pointer;
  background: #ffffff;
  margin-bottom: 10px;
  border-radius: 15px;
  box-shadow: 5px -5px 10px #a80064, -5px 5px 10px #fc0096;
  :hover {
    border-color: ${({ bch = 0 }) => (bch === 1 ? "#ff8d00;" : "#5ebd6d")};
  }
  @media (max-width: 768px) {
    width: 170px;
    height: 170px;
  }
`;

const Copied = styled.div`
  font-size: 18px;
  font-weight: bold;
  width: 100%;
  text-align: center;

  background-color: ${({ bch = 0 }) => (bch === 1 ? "#f59332;" : "#5ebd6d")};
  color: #fff;
  position: absolute;
  top: 65px;
  padding: 30px 0;
  @media (max-width: 768px) {
    top: 52px;
    padding: 20px 0;
  }
`;

const CustomInput = styled.div`
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  margin-bottom: 15px;
  padding: 10px 0;
  font-family: "Roboto Mono", monospace;
  border-radius: 5px;

  span {
    font-weight: bold;
    color: #44444;
    font-size: 16px;
  }
  input {
    border: none;
    width: 100%;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    color: #444;
    padding: 10px 0;
    background: transparent;
    margin-bottom: 15px;
    display: none;
  }
  input:focus {
    outline: none;
  }
  input::selection {
    background: transparent;
    color: #444;
  }
  @media (max-width: 768px) {
    font-size: 11px;
    span {
      font-size: 12px;
    }
    input {
      font-size: 11px;
      margin-bottom: 10px;
    }
  }
  @media (max-width: 360px) {
    font-size: 10px;
    span {
      font-size: 11px;
    }
    input {
      font-size: 11px;
      margin-bottom: 10px;
    }
  }
`;

export const QRCode = ({
  address,
  size = 230,
  onClick = () => null,
  ...otherProps
}) => {
  const [visible, setVisible] = useState(false);
  const trimAmount = 6;

  const address_trim = address ? address.length - trimAmount : "";

  const txtRef = React.useRef(null);

  const handleOnClick = (evt) => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 1500);
    onClick(evt);
  };

  const handleOnCopy = () => {
    // Event.("Category", "Action", "Label")
    // BCH or slp?
    let eventLabel = currency.ticker;
    if (address) {
      const isToken = address.includes(currency.tokenPrefix);
      if (isToken) {
        eventLabel = currency.tokenTicker;
      }
      // Event('Category', 'Action', 'Label')
      Event("Wallet", "Copy Address", eventLabel);
    }

    setVisible(true);
    setTimeout(() => {
      txtRef.current.select();
    }, 100);
  };

  return (
    <CopyToClipboard
      style={{
        display: "inline-block",
        width: "100%",
        position: "relative",
      }}
      text={address}
      onCopy={handleOnCopy}
    >
      <div style={{ position: "relative" }} onClick={handleOnClick}>
        <Copied
          bch={address && address.includes("bitcoin") ? 1 : 0}
          style={{ display: visible ? null : "none" }}
        >
          Copied
        </Copied>

        <StyledRawQRCode
          id="borderedQRCode"
          value={address || ""}
          size={size}
          bch={address && address.includes("avax") ? 1 : 0}
          renderAs={"svg"}
          includeMargin
          bgColor="#FFFFFF"
          fgColor="#000B43"
          imageSettings={{
            src: currency.tokenLogo,
            x: null,
            y: null,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />

        {address && (
          <CustomInput>
            <input
              ref={txtRef}
              readOnly
              value={address}
              spellCheck="false"
              type="text"
            />
            <span>{address}</span>
          </CustomInput>
        )}
      </div>
    </CopyToClipboard>
  );
};
