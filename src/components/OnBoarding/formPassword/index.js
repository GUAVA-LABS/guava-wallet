import React, { useState, useCallback } from 'react';

import {FiEyeOff, FiEye} from 'react-icons/fi';

import { WalletContext } from "@utils/context";

import { Container, Submit } from './styles'

export const FormPassword = ({setMnemonic, setDecrypt}) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, decryptData } = ContextValue;

  const [password, setPassword] = useState('');

  const [passwordView, setPasswordView] = useState(false);
  
  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleDecrypt = useCallback((e) => {
    e.preventDefault();
    const data = decryptData(password, wallet.mnemonicCypher);
    if (data) {
      setDecrypt(true);
      setMnemonic(data);
    }
    setPassword('');
  }, [decryptData, password, setDecrypt, setMnemonic, wallet.mnemonicCypher]);

  return (
    <Container>
      <form onSubmit={handleDecrypt}>

        <input 
          name='password' 
          className='confirm-input' 
          placeholder='Password' 
          type={!passwordView ? 'password' : 'text'}
          onChange={(e) => handlePasswordChange(e)}
        />

        <button 
          type='button' 
          onClick={() => (setPasswordView(!passwordView))} 
        >
        {!passwordView ? <FiEyeOff/> : <FiEye/>}
        </button>
        
        <Submit>
          <button 
            type='submit' 
            onSubmit={handleDecrypt} 
          >
            Recover
          </button>
        </Submit>
      
      </form>
    </Container>
  );
};
