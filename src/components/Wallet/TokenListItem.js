import React from "react";
import styled from "styled-components";
import makeBlockie from "ethereum-blockies-base64";
import { Img } from "react-image";

const TokenIcon = styled.div`
  height: 32px;
  width: 32px;
`;

const BalanceAndTicker = styled.div`
  font-size: 1rem;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  border-radius: 3px;
  margin-bottom: 3px;
  background: #ffffff;
  box-shadow: 5px -5px 10px #a80064, -5px 5px 10px #fc0096;
`;

const TokenListItem = ({ ticker, balance, tokenId }) => {
  console.log(ticker);
  return (
    <Wrapper>
      <TokenIcon>
        <img
          alt={`identicon of tokenId ${tokenId} `}
          height="32"
          width="32"
          style={{
            borderRadius: "50%",
          }}
          key={`identicon-${tokenId}`}
          src={makeBlockie(tokenId)}
        />
      </TokenIcon>
      <BalanceAndTicker>
        {balance} <strong>{ticker}</strong>
      </BalanceAndTicker>
    </Wrapper>
  );
};

export default TokenListItem;
