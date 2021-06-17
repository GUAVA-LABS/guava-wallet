import React from "react";
import TokenListItem from "./TokenListItem";
import { Link } from "react-router-dom";

const TokenList = ({ tokens }) => {
  return (
    <div>
      {tokens.map((token) => (
        <Link key={token.id} to={`/send-asset/${token.id}`}>
          <TokenListItem
            ticker={token.ticker}
            tokenId={token.id}
            balance={token.balance}
          />
        </Link>
      ))}
    </div>
  );
};

export default TokenList;
