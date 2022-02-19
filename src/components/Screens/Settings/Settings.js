import React, { useState, useCallback } from "react";
import { WalletContext } from "@utils/context";

import InfoBar from '@components/Common/InfoBar';

import DeleteModal from './DeleteModal';

import './Settings.css';

const Settings = () => {
    const ContextValue = React.useContext(WalletContext);
    const { wallet, deleteWallet, decryptData } = ContextValue;
  
    const[open, setOpen] = useState({
      open: false
    });

    const [backup, setBackup] = useState(false);
    const [password, setPassword] = useState('');
    const [mnemonic, setMnemonic] = useState(false);
    const [decpryt, setDecrypt] = useState(false);

    const handleOpen = useCallback(() => {
      setOpen({open: !open.open});
    }, [open.open]);

    const handlePasswordChange = useCallback((e) => {
      setPassword(e.target.value);
    }, []);

  const handleDecrypt = useCallback(async (e) => {
    e.preventDefault();
    const data = decryptData(password, wallet.mnemonicCypher);
    if (data) {
      setDecrypt(true);
      setMnemonic(data);
    }
    setPassword('');
  }, [decryptData, password, wallet.mnemonicCypher]);

    return (
        <div className='container'>
            <InfoBar 
              title='Backup your wallet'
              droppable='true' 
              content={
                  <div>
                    <form onSubmit={handleDecrypt}>
                      <input 
                        name='password' 
                        className='confirm-input' 
                        placeholder='Password' 
                        type='password'
                        onChange={(e) => handlePasswordChange(e)}
                      />
                    </form>
                    {decpryt ? 
                      mnemonic : ""
                    }
                  </div>
              }/>
               

        
         
          

          <InfoBar
            title='Documentation'
            link='https://docs.guavawallet.com'
          />
          
          <div onClick={ () => handleOpen()}>
            <InfoBar delete />
            { open.open && (
              <DeleteModal 
                open={open} 
                setOpen={setOpen} 
                deleteWallet={deleteWallet} 
              />
            )}
          </div>
        </div>
    );
};

export default Settings;