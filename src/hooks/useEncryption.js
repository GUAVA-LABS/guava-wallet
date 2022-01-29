import React from 'react';
import SJCL from 'sjcl';

export const ENCRYPTION_STATUS_CODE = {
    EMPTY: 0,
    ENCRYPTED: 1,
    DECRYPTED: 2
}

const getInitialState = (mnemonicCypher) => {
    console.log('mnemonicCypher on getInit() on useEncr.js:', mnemonicCypher);
    if (!mnemonicCypher) {
        return ENCRYPTION_STATUS_CODE.DECRYPTED;
    }

    return ENCRYPTION_STATUS_CODE.ENCRYPTED;
}

const useEncryption = (mnemonicCypher) => {
    const [encryptionStatus, setEncryptionStatus] = React.useState(getInitialState(mnemonicCypher));

    const encrypt = (password, data) => {
        const encryptedCypher = SJCL.encrypt(password, JSON.stringify(data));
        setEncryptionStatus(ENCRYPTION_STATUS_CODE.ENCRYPTED)
        return encryptedCypher;
    }

    const decrypt = (password, cypher) => {
        try {
            const decryptedData = JSON.parse(SJCL.decrypt(password, cypher));
            setEncryptionStatus(ENCRYPTION_STATUS_CODE.DECRYPTED);
            return decryptedData;
        } catch(e) {
            return false;
       
        }
    }

    const decryptData = (password, cypher) => {
        try {
            const decryptedData = JSON.parse(SJCL.decrypt(password, cypher));
            return decryptedData;
        } catch(e) {
            return false;
        }
    }

    return {
        encryptionStatus,
        encrypt,
        decrypt,
        decryptData,
        setEncryptionStatus
    }
}

export default useEncryption;