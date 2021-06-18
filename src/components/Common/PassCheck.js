import React from "react";
import { WalletContext } from "@utils/context";
import FormPassword from "@components/OnBoarding/formPassword";

export default function PassCheck(props) {
  const ContextValue = React.useContext(WalletContext);
  const { wallet } = ContextValue;
  const advice = props.advice;
  return (
    <>
      <FormPassword getWallet={() => wallet} textSubmit="Reveal Seed">
        <p>{wallet && wallet.mnemonic ? wallet.mnemonic : ""}</p>
      </FormPassword>
      <div style={span_style}>{advice}</div>
    </>
  );
}

const comp_style = {
  display: "flex",
  justifyContent: "center",
  margin: "auto 20px",
  padding: "10px",
};
const button_style = {
  border: "solid 2px #DC1199",
  backgroundColor: "#DC1199",
  padding: "6px 14px",
  borderRadius: "6px",
  color: "white",
  margin: "10px",
};
const input_style = {
  border: "solid 2px #DC1199",
  backgroundColor: "#fff",
  padding: "6px",
  borderRadius: "6px",
  margin: "10px",
};
const span_style = {
  textAlign: "center",
  color: "#011437",
  fontSize: "12px",
  marginTop: "14px",
};
