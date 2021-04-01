import React from 'react';
import {
    Avalanche,
    BN,
    BinTools,
  } from "avalanche";
  import { KeyPair } from 'avalanche/dist/apis/avm'
import { getPreferredHRP } from 'avalanche/dist/utils'
import useAsyncTimeout from '@hooks/useAsyncTimeout';
import HDKey from 'hdkey';
import Big from 'big.js';
import axios from 'axios';
import { currency } from '@components/Common/Ticker';
import { bnToBig } from './helpers';
const bip39 = require('bip39');

// eslint-disable-next-line react-hooks/exhaustive-deps
const useMountEffect = (fun) => React.useEffect(fun, [])

//TODO: Move these values to REACT_ENV variables
const testnet = false;
const environmentVariables = {
    NETWORK_ID: 1,
    BLOCKCHAIN_ID: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
    AVA_NODE_IP: "guavanode.ngrok.io"
}

const useWallet = () => {
    const INTERVAL_IN_MILISECONDS = 10000;
    const AVA_ACCOUNT_PATH = `m/44'/9000'/0'`;
    const bintools = BinTools.getInstance();
    const { NETWORK_ID, BLOCKCHAIN_ID, AVA_NODE_IP } = environmentVariables;
    let avalancheInstance = new Avalanche(AVA_NODE_IP, 443, "https", NETWORK_ID, BLOCKCHAIN_ID);
    let xchain = avalancheInstance.XChain();

    const [wallet, setWallet] = React.useState(false);
    const [fiatPrice, setFiatPrice] = React.useState(0);

    const createWallet = importMnemonic => {
        const mnemonic = importMnemonic || bip39.generateMnemonic(256);
        const privateKey = derivePrivateKeyFromMnemonic(mnemonic);
        const keychainInstance = importedKeychainInstance(privateKey);
        const addressStrings = keychainInstance.getAddressStrings();
        window.localStorage.setItem("guava-wallet", JSON.stringify({ mnemonic, address: addressStrings[0], avaxBalance: 0})) 
    };

    const derivePrivateKeyFromMnemonic = mnemonic => {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const masterHdKey = HDKey.fromMasterSeed(seed);
        const accountHdKey = masterHdKey.derive(AVA_ACCOUNT_PATH);
       
        return accountHdKey.privateKey;
    }

    const importedKeychainInstance = privateKeyBuffer => {
        const keychainInstance = xchain.keyChain();
       keychainInstance.importKey(privateKeyBuffer); 
       return keychainInstance;
    }

    const getWalletFromLocalStorage = async () => {
        const wallet = window.localStorage.getItem("guava-wallet");
        if (wallet) {
            const parsedWalletFromLocalStorage = JSON.parse(wallet);
            const privateKey = derivePrivateKeyFromMnemonic(parsedWalletFromLocalStorage.mnemonic);
            const keychainInstance = importedKeychainInstance(privateKey);
       
            const addressStrings = keychainInstance.getAddressStrings();
            let balances = await xchain.getAllBalances(addressStrings[0]);
            const avaxBalance = balances.filter(x => x.asset === 'AVAX').pop();
            const avaxBalanceValue = avaxBalance ? bnToBig(avaxBalance.balance, 9).toString() : "0";
            return {  xchain, keychainInstance, mnemonic: parsedWalletFromLocalStorage.mnemonic, address: addressStrings[0], avaxBalance: avaxBalanceValue  };
        }
    }

    const sendAssetXChain = async (amount, destinationAddress) => {
            Big.NE = -(9- 1);
           console.log(amount);
           const sendAmount = new BN(new Big(amount).times(Big(Math.pow(10, 9))).toString());

            console.log(sendAmount);
            const { keychainInstance, xchain  } = await getWalletFromLocalStorage();
            const txFee = xchain.getTxFee();
            const sendAmountWithTxFee = sendAmount.sub(txFee);
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

            const { utxoset, assetID, toAddress, fromAddresses, changeAddresses } = baseTransactionOptions;
            const unsignedTransaction = await xchain.buildBaseTx(utxoset, sendAmountWithTxFee, assetID, [toAddress], fromAddresses, changeAddresses);
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

    const fetchFiatPrice = async () => {
        const fetchedPriceObject= await axios.get(currency.priceApi);
        setFiatPrice(fetchedPriceObject.data["usd"]);
    };

    useMountEffect(setExistingWalletOnFirstMount);

    useAsyncTimeout(async () => {
        const wallet = await getWalletFromLocalStorage();
        setWallet(wallet);
    }, INTERVAL_IN_MILISECONDS);

    useAsyncTimeout(async () => {
        fetchFiatPrice();
    }, INTERVAL_IN_MILISECONDS);

    
    return {
        sendAssetXChain,
        getWalletFromLocalStorage,
        createWallet,
        wallet,
        setWallet,
        tokens: [],
        fiatPrice
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
