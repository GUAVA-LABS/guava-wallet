import React from "react";
import styled from "styled-components";
import { Collapse, Spin, Alert } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { WalletContext } from "@utils/context";
import { StyledCollapse } from "@components/Common/StyledCollapse";
import { SecondaryButton } from "@components/Common/PrimaryButton";
import {
  CashLoadingIcon,
  ThemedCopyOutlined,
} from "@components/Common/CustomIcons";
import FormPassword from '@components/OnBoarding/formPassword';

const { Panel } = Collapse;
const StyledConfigure = styled.div`
  h2 {
    color: #444;
    font-size: 25px;
  }
  p {
    color: #444;
  }
`;
const Configure = () => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, deleteWallet } = ContextValue;
  return (
    <Spin spinning={false} indicator={CashLoadingIcon}>
      <StyledConfigure>
        <FormPassword getWallet={() => wallet} textSubmit="Unlock Wallet to check settings.">
          <h2>
            <ThemedCopyOutlined /> Backup your wallet
          </h2>
          <Alert
            style={{ marginBottom: "12px" }}
            description="Your seed phrase is the only way to restore your wallet. Write it down. Keep it safe."
            type="warning"
            showIcon
          />
          {wallet && wallet.mnemonic && (
            <StyledCollapse>
              <Panel header="Click to reveal seed phrase" key="1">
                <p>{wallet && wallet.mnemonic ? wallet.mnemonic : ""}</p>
              </Panel>
            </StyledCollapse>
          )}

          <h2 style={{ marginTop: "12px" }}>
            <DeleteOutlined /> Remove wallet
          </h2>
          <Alert
            style={{ marginBottom: "12px" }}
            description="Your data will be totally erased. Remember to backup your seed before deleting your wallet."
            type="error"
            showIcon
          />
            {wallet && wallet.mnemonic && (
              <StyledCollapse>
                <SecondaryButton onClick={() => deleteWallet()}>
                  Delete Wallet
                </SecondaryButton>
              </StyledCollapse>
            )}
        </FormPassword>
      </StyledConfigure>
    </Spin>
  );
};

export default Configure;
