import { findLastKey } from 'lodash';
import React from 'react';
import SJCL from 'sjcl';

const ENCRYPT_STATE = {
    EMPTY: 0,
    ENCRYPTED: 1,
    DECRYPTED: 2
}

const useEncryption = () => {
    const [encrypted, setEncrypted] = React.useState(ENCRYPT_STATE.EMPTY);

    const encrypt = (password, data) => {
        const encryptedCypher = SJCL.encrypt(password, JSON.stringify(data));
        setEncrypted(ENCRYPT_STATE.ENCRYPTED)
        return encryptedCypher;
    }

    const decrypt = (password, cypher) => {
        try {
            const decryptedData = JSON.parse(SJCL.decrypt(password, cypher));
            setEncrypted(ENCRYPT_STATE.DECRYPTED);
            return decryptedData;
        } catch(e) {
            return false;
        }
    }
}

export default useEncryption;