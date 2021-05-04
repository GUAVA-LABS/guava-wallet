import React, { useState } from "react";
import styled from "styled-components";
import { Collapse, Spin, Alert, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { WalletContext } from "@utils/context";
import { StyledCollapse } from "@components/Common/StyledCollapse";
import { SecondaryButton } from "@components/Common/PrimaryButton";
import {
  CashLoadingIcon,
  ThemedCopyOutlined,
} from "@components/Common/CustomIcons";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
 
  function showDeleteModal() {
    setIsModalVisible(true)

  }
  


  return (
    <Spin spinning={false} indicator={CashLoadingIcon}>
      <StyledConfigure>
          <h2>
            <ThemedCopyOutlined /> Backup your wallet
          </h2>
          <Alert
            style={{ marginBottom: "12px" }}
            description="Your seed phrase is the only way to restore your wallet. Write it down. Keep it safe."
            type="warning"
            showIcon
          />
            <StyledCollapse>
              <Panel header="Click to reveal seed phrase" key="1">
                <p>{wallet && wallet.mnemonic ? wallet.mnemonic : ""}</p>
              </Panel>
            </StyledCollapse>

          <h2 style={{ marginTop: "12px" }}>
            <DeleteOutlined /> Remove wallet
          </h2>
          <Alert
            style={{ marginBottom: "12px" }}
            description="Your data will be totally erased. Remember to backup your seed before deleting your wallet."
            type="error"
            showIcon
          />
            <StyledCollapse>
              <SecondaryButton onClick={() => showDeleteModal()}>
                Delete Wallet
              </SecondaryButton>
            </StyledCollapse>
        </StyledConfigure>
        
        <Modal 
        title="Are you sure you want to delete it?" 
        visible={isModalVisible} 
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
                           deleteWallet();
                           
                       }}
                       >
                       <div>
                               {"When you delete your wallet you loose everything. Make sure you have the backup and/or the seed phrase."}
                       </div>
        </Modal>
    </Spin>
   




  );
};

export default Configure;
    