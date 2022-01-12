import React, { useState, useEffect } from "react";
import { WalletContext } from "@utils/context";
import FormPassword from '@components/OnBoarding/formPassword'
import InfoBar from '@components/Common/InfoBar'
import './Settings.css'
import DeleteModal from './DeleteModal'

const Settings = () => {
    const ContextValue = React.useContext(WalletContext);
    const { wallet, deleteWallet } = ContextValue;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
  
    const confirmDelete = () => {

      setIsOpenDelete(!isOpenDelete);
      console.log(isOpenDelete);
    }
    const[open, setOpen] = useState({
      open: false
    });

    useEffect(() => {
      console.log('working')
      console.log(open)

    }, [open])
    function handleOpen(action) {
      setOpen({open:!open.open})
  };
    return (
      <>
        <div className='container'>
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
          <div onClick={ () => handleOpen()}
          >
            <InfoBar 
              delete
            />
        </div>
         { open.open ? <DeleteModal isOpenDelete={isOpenDelete} open={open} setOpen={setOpen} deleteWallet={deleteWallet} /> : null }
          </div>
      </>
     
  
  
  
  
    );
};

export default Settings;