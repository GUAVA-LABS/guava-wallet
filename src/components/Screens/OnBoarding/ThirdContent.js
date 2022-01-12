import React, {useState} from 'react'
import onboardingImg from '@assets/guava-onboarding.png'
import FormPassword from './formPassword'
import { WalletContext } from '@utils/context';
import { ENCRYPTION_STATUS_CODE } from '@hooks/useEncryption';




const ThirdContent = (props) => {
    const ContextValue = React.useContext(WalletContext);
    const { createWallet } = ContextValue;
    const { encrypt, decrypt, encryptionStatus, setWallet } = ContextValue;
    const [callAfterSubmit, setCalldAfterSubmit] = React.useState(false);
    const confirmPassword = true;
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirm] = useState('');

    const handleChange = e => {
        console.log(e)
        const { value, name } = e.target;
        console.log(name)
        setPass(value)
        console.log(pass)
    };
    const handleConfirm = e => {
        console.log(e)
        const { value, name } = e.target;
        console.log(name)
        setConfirm(value)
        console.log(confirmPass)
    };

    const getWallet = () => {
        const wallet = createWallet(props.formData.mnemonic || false);
        return wallet;
        }

    const onConfirmPassword = values => {
        if (!confirmPassword) return true;
        if (values.password === values.confirmPassword) return true;
        return Promise.reject(new Error('The two passwords that you entered do not match!'));
        }
        
    const onFinish =  (values) => {
        const wallet = getWallet();
        // const { password } = values;
        const password = values;

        console.log('password is working', password);
        console.log('current encryption status', encryptionStatus);

        onConfirmPassword(values);

        switch (encryptionStatus) {
          case ENCRYPTION_STATUS_CODE.DECRYPTED:

            const mnemonicCypher = encrypt(password, wallet.mnemonic);

            console.log('mnemonic cypher objects', password, wallet, mnemonicCypher);

            setWallet({
              ...wallet,
              mnemonicCypher,
              mnemonic: false
            });

            setCalldAfterSubmit(true)

            break;
          case ENCRYPTION_STATUS_CODE.ENCRYPTED:

            console.log('decrypt', password, wallet);

            const decryptedMnemonic = decrypt(password, wallet.mnemonicCypher);

            console.log(decryptedMnemonic);

            setWallet({
              ...wallet,
              mnemonic: decryptedMnemonic,
            });

            setCalldAfterSubmit(true)

            break;

          default:
        }
      }


    return(
        <div className='content-center'>
            <div className='onboarding-item'>
                <img className='ob-img' src={onboardingImg} />
            </div>
            <div className='onboarding-item'>
                <span className='h1-title'>
                    Create your Wallet Password
                </span>
            </div>
            <div className='onboarding-item'>
                <div className='slide-content'>
                    <input type='text' placeholder='Password' onChange={e => handleChange(e)} type='password'/>
                    <input type='text' placeholder='Confirm password' onChange={e => handleConfirm(e)} type='password'/>
                </div>
            </div>
            <div className='onboarding-item'>
                <a className='onboarding-btn bg-pink-1 onboarding-buttons' onClick={() => pass == confirmPass && pass.length >= 8 ? onFinish(pass) : window.alert('You need to confirm your password and have at least 8 characters')}>
                    {/* <NewWalletIcon color='white' size='18px' />  */}
                    <span className='ml-5'>
                        { props.setUp ? 'Make me a Wallet' : 'Import my Wallet'}
                    </span>
                </a>
            </div>
            <div className='onboarding-item'>
                <a className='onboarding-btn bg-blue-1 onboarding-buttons' onClick={() => props.setSlide(props.slider-1)}>
                    {/* <ImportWalletIcon color='white' size='18px' /> */}
                    <span className='ml-5'>
                        Go Back
                    </span>
                </a>
            </div>
        </div>
    )
}

export default ThirdContent;