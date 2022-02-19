import React, { useState, useCallback } from 'react';

import { WalletContext } from "@utils/context";

export const FormPassword = ({setMnemonic, setDecrypt}) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, decryptData } = ContextValue;

  const [password, setPassword] = useState('');

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
    <form onSubmit={handleDecrypt}>
      <input 
        name='password' 
        className='confirm-input' 
        placeholder='Password' 
        type='password'
        onChange={(e) => handlePasswordChange(e)}
      />
      <button 
        type='submit' 
        onSubmit={handleDecrypt} 
      >
        show
      </button>
    </form>
  );
};
