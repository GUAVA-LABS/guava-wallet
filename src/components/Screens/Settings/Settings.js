import React, { useState, useCallback } from "react";
import { WalletContext } from "@utils/context";

import InfoBar from '@components/Common/InfoBar';

import { FormPassword } from '../../OnBoarding/formPassword';

import DeleteModal from '../../Common/Modals/Delete';

import './Settings.css';

const Settings = () => {
    const ContextValue = React.useContext(WalletContext);
    const { deleteWallet } = ContextValue;
  
    const[open, setOpen] = useState({
      open: false
    });

    const [mnemonic, setMnemonic] = useState(false);
    const [decpryt, setDecrypt] = useState(false);

    const handleOpen = useCallback(() => {
      setOpen({open: !open.open});
    }, [open.open]);

    return (
        <div className='container'>
            <InfoBar 
              title='Backup your wallet'
              droppable='true' 
              content={
                  <>
                    {decpryt ? 
                      mnemonic : 
                      <FormPassword 
                        setMnemonic={setMnemonic}
                        setDecrypt={setDecrypt}
                      />
                    }
                  </>
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