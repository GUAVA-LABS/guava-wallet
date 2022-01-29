import React, {useState, useEffect, useCallback} from 'react'
import './Send.css'
import { WalletContext } from "@utils/context";
// import FormPassword from "@components/OnBoarding/formPassword";
import Modal from "../../../components/Common/Modal/modal";
import { ENCRYPTION_STATUS_CODE } from '@hooks/useEncryption';


const Send = ({ filledAddress, callbackTxId }) => {
    const ContextValue = React.useContext(WalletContext);
    const { wallet, sendAssetXChain/*, apiError, txFee*/ } = React.useContext(
      WalletContext
    );

    const { avaxBalance } = wallet;
    const [formData, setFormData] = useState({
      dirty: true,
      address: filledAddress || "",
      amount:0,
      password:''
    });
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [callAfterSubmit, setCalldAfterSubmit] = React.useState(false);


    const afterSubmit = () => {
      console.log('enviando a: '+ formData.address)
      submit();
    };

    // React.useEffect(() => {
    //   (async () => {
    //     if (callAfterSubmit) {
    //       console.log('UseEffect callAfterSubmit')
    //       afterSubmit()};
    //     setCalldAfterSubmit(false);
    //   })();
    // }, [callAfterSubmit, afterSubmit]);


    const confirmTx = () => {

      setIsOpenConfirm(!isOpenConfirm);
      console.log(isOpenConfirm);
    }
    const[open, setOpen] = useState({
      open: false
    });

    useEffect(() => {

    }, [open])
    function handleOpen(action) {
      setOpen({open:!open.open})
  };

  const submit = useCallback(async({wallet}) => {
    setFormData({
      ...formData,
      dirty: false,
    });
    if (formData.address === '' || Number(formData.amount) <= 0) {
      return;
    }

      const { address, amount } = formData;
      console.log('submited');
      if (wallet.mnemonic) {
        console.log('onIf');
        try {
          console.log('mnemonic on Submit Function:', wallet.mnemonic, 'mnemonicCypher:',wallet.mnemonicCypher)
          console.log('amountSubmitFunction:',amount, 'addressSubmitFunction:',address)
          const link = await sendAssetXChain(amount, address);
          console.log("txid", link);
        } catch (e) {
          console.log(e);
          console.error(e);
        }
      }else{
        console.log('failed');
      }
  }, [formData, sendAssetXChain]);

    const sendConfirmation = useCallback(async() => {
      const { encrypt, decrypt, encryptionStatus, setWallet } = await ContextValue;
        const password = await formData.password;
        console.log('current encryption status', encryptionStatus);
        switch (encryptionStatus) {
          case ENCRYPTION_STATUS_CODE.DECRYPTED:
            const mnemonicCypher = await encrypt(password, wallet.mnemonic);
            console.log('mnemonic cypher objects on DECRYPTED case', password, wallet, mnemonicCypher);
            await setWallet({
              ...wallet,
              mnemonicCypher,
              mnemonic: false
            });
            // setCalldAfterSubmit(true)
          break;
            
          case ENCRYPTION_STATUS_CODE.ENCRYPTED:
              console.log('decrypt', password, wallet);
              const decryptedMnemonic = await decrypt(password, wallet.mnemonicCypher);
              console.log('decryptedMnemonic:',decryptedMnemonic);
              setWallet({
                ...wallet,
                mnemonic: decryptedMnemonic,
              });
              console.log('walletDecryptedMnemonic on ENCRYPTED CASE:',wallet);
              setCalldAfterSubmit(true);
              submit({wallet:  {...wallet, mnemonic: decryptedMnemonic}});
          break;
              
          default:
          
          }
    }, [ContextValue, formData.password, submit]);
  
    const handleAddressChange = (e) => {
      const { value, name } = e.target;
      setFormData((p) => ({
        ...p,
        [name]: value,
      }));
      console.log('handleAddressChange:',value)
    };
  
    const handleAmountChange = (e) => {
        const { value, name } = e.target;
        let amount = value;
        setFormData((p) => ({
        ...p, [name]: amount }));
        console.log('handleAmountChange:',amount)
    };
    
    const handlePasswordChange = (e) => {
        const { value, name } = e.target;
        let password = value;
        setFormData((p) => ({
        ...p, [name]: password }));
        console.log('handlePasswordChange:',password)
    };


    return (
      <>
        <div className='send'>
            <input name='address' className='send-input' type='text' placeholder='AVAX Address' onChange={(e) => handleAddressChange(e)}/>
            <input name='amount' className='send-input' type='text' placeholder='Amount' onChange={(e) => handleAmountChange(e)}/>
            <a className='send-btn' onClick={() => handleOpen('confirm')}>Send</a>
            <div className='confirm-send'>
              { open.open ?
                <Modal
                  isOpenDelete={isOpenConfirm}
                  open={open}
                  setOpen={setOpen}
                  warning={'Transaction fee: 0.001 AVAX'}
                  title={'Confirm transaction with password'}
                  continueBtnTitle={'Send'} 
                  content={
                    <input name='password' className='confirm-input' type='text' placeholder='Password' type='password'
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