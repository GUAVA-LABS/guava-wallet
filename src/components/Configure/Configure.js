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
import FormPassword from '@components/OnBoarding/formPassword'
import InfoBar from '@components/Common/InfoBar'
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
      <InfoBar 
        title='Backup your wallet'
        droppable='true' 
        content={
          <FormPassword
            getWallet={() => wallet}
            textSubmit="Show"
          >
            <p>{wallet && wallet.mnemonic ? wallet.mnemonic : ""}</p>
          </FormPassword>}
      />
      <div onClick={() => showDeleteModal()}>
        <InfoBar 
          delete
        />
      </div>
      <StyledConfigure>
          {/* <h2>
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
		  <FormPassword
                    getWallet={() => wallet}
                    textSubmit="Reveal Seed"
                  >
			<p>{wallet && wallet.mnemonic ? wallet.mnemonic : ""}</p>
		</FormPassword>
              </Panel>
            </StyledCollapse> */}
          {/* <Alert
            style={{ marginBottom: "12px" }}
            description="Your data will be totally erased. Remember to backup your seed before deleting your wallet."
            type="error"
            showIcon
          /> */}
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
const delete_btn_style = {
  width: '100%',
  padding: '10px',
  color: '#011437',
  backgroundColor: 'white',
  border: 'none',
  margin: 'auto',
  borderRadius: '6px',
  boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.16)',
  fontWeight: '600',
  fontSize:'11pt',
  margin:'auto',
  textAlign:'left',
  fontWeight:'600',
  marginTop:'10px',
}

export default Configure;
    
