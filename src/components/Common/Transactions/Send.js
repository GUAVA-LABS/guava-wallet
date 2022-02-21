import React, {useState, useCallback} from 'react'
import './Send.css'
import { WalletContext } from "@utils/context";
import Modal from "../../../components/Common/Modals/modal";
import { ENCRYPTION_STATUS_CODE } from '@hooks/useEncryption';


const Send = ({ filledAddress }) => {
    const ContextValue = React.useContext(WalletContext);
    const { wallet, sendAssetXChain } = React.useContext(
      WalletContext
    );
    
    const { decryptData, encryptionStatus } = ContextValue;


    const [formData, setFormData] = useState({
      dirty: true,
      address: filledAddress || "",
      amount:0,
      password:''
    });

    const[open, setOpen] = useState({
      open: false
    });
    
    function handleOpen() {
      setOpen({open:!open.open})
    };

  const submit = useCallback(async (mnemonic) => {
    setFormData({
      ...formData,
      dirty: false,
    });
    if (formData.address === '' || Number(formData.amount) <= 0) {
      return;
    }

      const { address, amount } = formData;
      if (mnemonic) {
        console.log('onI mnemonic');
        try {
          console.log('mnemonic on Submit Function:', mnemonic, 'mnemonicCypher:',wallet.mnemonicCypher)
          console.log('amountSubmitFunction:',amount, 'addressSubmitFunction:',address)
          const link = await sendAssetXChain(amount, address, mnemonic);
          console.log("txid", link);
    
        } catch (e) {
          console.log(e);
          console.error(e);
        }
      }else{
        console.log('if wallet.mnemonic failed', mnemonic);
      }
  }, [formData, sendAssetXChain, wallet]);


    const sendConfirmation = useCallback(async () => {
        const password = formData.password;
        console.log('current encryption status', encryptionStatus);
        
        switch (encryptionStatus) {            
          case ENCRYPTION_STATUS_CODE.ENCRYPTED:
              const mnemonic = decryptData(password, wallet.mnemonicCypher)
              console.log(mnemonic, 'mnem DecryptedData');
              submit( mnemonic );
          break;
              
          default:
          
        }
    }, [decryptData, encryptionStatus, formData.password, submit, wallet]);
  
    const handleAddressChange = (e) => {
      const { value, name } = e.target;
      setFormData((p) => ({
        ...p,
        [name]: value,
      }));
    };
  
    const handleAmountChange = (e) => {
        const { value, name } = e.target;
        let amount = value;
        setFormData((p) => ({
        ...p, [name]: amount }));
    };
    
    const handlePasswordChange = (e) => {
        const { value, name } = e.target;
        let password = value;
        setFormData((p) => ({
        ...p, [name]: password }));
    };

    return (
      <>
        <div className='send'>
            <input name='address' className='send-input' type='text' placeholder='AVAX Address' onChange={(e) => handleAddressChange(e)}/>
            <input name='amount' className='send-input' type='text' placeholder='Amount' onChange={(e) => handleAmountChange(e)}/>
            <button className='send-btn' onClick={() => handleOpen('confirm')}>Send</button>
            <div className='confirm-send'>
              { open.open ?
                <Modal
                  open={open}
                  setOpen={setOpen}
                  warning={'Transaction fee: 0.001 AVAX'}
                  title={'Confirm transaction with password'}
                  continueBtnTitle={'Send'} 
                  content={
                    <input name='password' className='confirm-input' placeholder='Password' type='password'
                      onChange={(e) => handlePasswordChange(e)}
                    />
                  }
                  sendConfirmation={sendConfirmation}
                /> : null 
              }
            </div>
        </div>
      </>
    );
  };

export default Send