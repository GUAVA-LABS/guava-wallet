import React from 'react';
import SJCL from 'sjcl';

export const ENCRYPTION_STATUS_CODE = {
    EMPTY: 0,
    ENCRYPTED: 1,
    DECRYPTED: 2
}

const useEncryption = () => {
    const [encryptionStatus, setEncryptionStatus] = React.useState(ENCRYPTION_STATUS_CODE.DECRYPTED);

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

    return {
        encryptionStatus,
        encrypt,
        decrypt
    }
}

export default useEncryption;