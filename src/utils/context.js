import React from 'react';
import {
    Avalanche,
    BN
  } from "avalanche";
import useAsyncTimeout from '@hooks/useAsyncTimeout';

// eslint-disable-next-line react-hooks/exhaustive-deps
const useMountEffect = (fun) => React.useEffect(fun, [])

//TODO: Move these values to REACT_ENV variables
const environmentVariables = {
    NETWORK_ID: 12345,
    BLOCKCHAIN_ID: "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed",
    AVA_NODE_HTTPS_URL: "guavanode.ngrok.io"
}

const useWallet = () => {
    const INTERVAL_IN_MILISECONDS = 10000;
    const { NETWORK_ID, BLOCKCHAIN_ID, AVA_NODE_HTTPS_URL } = environmentVariables;
    let avalancheInstance = new Avalanche(AVA_NODE_HTTPS_URL, 443, "https", NETWORK_ID, BLOCKCHAIN_ID);
    let xchain = avalancheInstance.XChain();

    const [wallet, setWallet] = React.useState(false);

    const createWallet = () => {
        const keychainInstance = xchain.keyChain();
        const addressBuffer = keychainInstance.makeKey();
        const addressStrings = keychainInstance.getAddressStrings();
        const privateKeyString = addressBuffer.getPrivateKeyString();
        window.localStorage.setItem("guava-wallet", JSON.stringify({ pk: privateKeyString, address: addressStrings[0] })) 
    };

    const importedKeychainInstance = privateKeyString => {
        const keychainInstance = xchain.keyChain();
        keychainInstance.importKey(privateKeyString);
        return keychainInstance;
    }

    const getWalletFromLocalStorage = async () => {
        const wallet = window.localStorage.getItem("guava-wallet");
        if (wallet) {
            const parsedWalletFromLocalStorage = JSON.parse(wallet);
            const keychainInstance = importedKeychainInstance(parsedWalletFromLocalStorage.pk)
            const addressStrings = keychainInstance.getAddressStrings();
            const balances = await xchain.getAllBalances(addressStrings[0]);
            return {  xchain, keychainInstance, pk: parsedWalletFromLocalStorage.pk, address: addressStrings[0], balances };
        }
    }

    const sendAssetXChain = async (amount, destinationAddress) => {
            const sendAmount = new BN(amount);
            const { pk: privateKey } = await getWalletFromLocalStorage();
            const keychainInstance = xchain.keyChain();
            keychainInstance.importKey(privateKey);
            const addressesFromSender = keychainInstance.getAddressStrings();
            const responseFromUTXOFetch = await xchain.getUTXOs(addressesFromSender);
            const avaxAssetIDBuffer= await xchain.getAVAXAssetID();
            const baseTransactionOptions = {
                utxoset: responseFromUTXOFetch.utxos,
                amount: sendAmount,
                assetID: avaxAssetIDBuffer,
                toAddress: destinationAddress,
                fromAddresses: addressesFromSender,
                changeAddresses: addressesFromSender
            }

            const unsignedTransaction = await xchain.buildBaseTx(...baseTransactionOptions);
            const signedTransaction = unsignedTransaction.sign(keychainInstance);
            const issuedTransactionID = await xchain.issueTx(signedTransaction);
            return issuedTransactionID;
    };


    const setExistingWalletOnFirstMount = () => {
        (async () => {
            const walletFromLocalStorage = await getWalletFromLocalStorage();
            setWallet(walletFromLocalStorage);
        })();
    }; 


    useMountEffect(setExistingWalletOnFirstMount);

    useAsyncTimeout(async () => {
        const wallet = await getWalletFromLocalStorage();
        setWallet(wallet);
    }, INTERVAL_IN_MILISECONDS);

    
    return {
        sendAssetXChain,
        getWalletFromLocalStorage,
        createWallet,
        wallet,
        setWallet,
        tokens: [],
    }
}

export const WalletContext = React.createContext(useWallet);

export const WalletProvider = ({ children }) => {
    const walletInstance = useWallet();

    return (
        <WalletContext.Provider value={walletInstance}>
            {children}
        </WalletContext.Provider>
    );
};
