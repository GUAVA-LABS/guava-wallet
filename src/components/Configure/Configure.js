import React, { useState } from "react";
import { Spin, Modal } from "antd";
import { WalletContext } from "@utils/context";
import {
  CashLoadingIcon,
} from "@components/Common/CustomIcons";
import FormPassword from '@components/OnBoarding/formPassword';
import InfoBar from '@components/Common/InfoBar';

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
      <InfoBar
        title='Documentation'
        link='https://docs.guavawallet.com'
      />
      <div onClick={() => showDeleteModal()}>
        <InfoBar 
          delete
        />
      </div>
       
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
    
