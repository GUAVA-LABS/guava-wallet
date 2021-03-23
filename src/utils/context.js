import React from 'react';
import {
    Avalanche,
    BN,
    BinTools,
  } from "avalanche";
import useAsyncTimeout from '@hooks/useAsyncTimeout';
import HDKey from 'hdkey';
const bip39 = require('bip39');

// eslint-disable-next-line react-hooks/exhaustive-deps
const useMountEffect = (fun) => React.useEffect(fun, [])

//TODO: Move these values to REACT_ENV variables
const testnet = false;
const environmentVariables = {
    NETWORK_ID: 1,
    BLOCKCHAIN_ID: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
    AVA_NODE_IP: testnet? "guavanode.ngrok.io" : "4b7d3d3d19d3.ngrok.io"
}

const useWallet = () => {
    const INTERVAL_IN_MILISECONDS = 10000;
    const AVA_TOKEN_INDEX = '9000';
    const AVA_ACCOUNT_PATH = `m/44'/${AVA_TOKEN_INDEX}'/0'`;
    const bintools = BinTools.getInstance();

    const { NETWORK_ID, BLOCKCHAIN_ID, AVA_NODE_IP } = environmentVariables;
    let avalancheInstance = new Avalanche(AVA_NODE_IP, 443, "https", NETWORK_ID, BLOCKCHAIN_ID);
    let xchain = avalancheInstance.XChain();

    const [wallet, setWallet] = React.useState(false);

    const createWallet = importMnemonic => {
        const mnemonic = importMnemonic || bip39.generateMnemonic(256);
        const privateKey = derivePrivateKeyFromMnemonic(mnemonic);
        const keychainInstance = importedKeychainInstance(privateKey);
        const addressStrings = keychainInstance.getAddressStrings();
        window.localStorage.setItem("guava-wallet", JSON.stringify({ mnemonic, address: addressStrings[0] })) 
    };

    const derivePrivateKeyFromMnemonic = mnemonic => {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const masterHdKey = HDKey.fromMasterSeed(seed);
        const accountHdKey = masterHdKey.derive(AVA_ACCOUNT_PATH);
        const privateKey = `PrivateKey-` + bintools.cb58Encode(Buffer.from(accountHdKey.privateKey));
        return privateKey;
    }
    const importedKeychainInstance = privateKeyString => {
        const keychainInstance = xchain.keyChain();
        keychainInstance.importKey(privateKeyString);
        return keychainInstance;
    }

    const getWalletFromLocalStorage = async () => {
        const wallet = window.localStorage.getItem("guava-wallet");
        if (wallet) {
            const parsedWalletFromLocalStorage = JSON.parse(wallet);
            const privateKey = derivePrivateKeyFromMnemonic(parsedWalletFromLocalStorage.mnemonic);
            const keychainInstance = importedKeychainInstance(privateKey);
            const addressStrings = keychainInstance.getAddressStrings();
            const balances = await xchain.getAllBalances(addressStrings[0]);
            return {  xchain, keychainInstance, mnemonic: parsedWalletFromLocalStorage.mnemonic, address: addressStrings[0], balances };
        }
    }

    const sendAssetXChain = async (amount, destinationAddress) => {
            const sendAmount = new BN(amount);
            const { keychainInstance } = getWalletFromLocalStorage();
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
