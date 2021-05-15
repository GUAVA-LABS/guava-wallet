import React from "react";
import { Avalanche, BN, BinTools } from "avalanche";
import useAsyncTimeout from "@hooks/useAsyncTimeout";
import HDKey from "hdkey";
import Big from "big.js";
import axios from "axios";
import { currency } from "@components/Common/Ticker";
import { bnToBig } from "./helpers";
import { notification } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import useEncryption, { ENCRYPTION_STATUS_CODE } from "@hooks/useEncryption";
const bip39 = require("bip39");

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (fun) => React.useEffect(fun, []);

const environmentVariables = {
  NETWORK_ID: Number(process.env.REACT_APP_NETWORK_ID),
  BLOCKCHAIN_ID: `${process.env.REACT_APP_BLOCKCHAIN_ID}`,
  AVA_NODE_IP: `${process.env.REACT_APP_AVA_NODE_IP}`,
};

const useWallet = () => {
  const INTERVAL_IN_MILISECONDS = 10000;
  const AVA_ACCOUNT_PATH = `m/44'/9000'/0'`;
  const bintools = BinTools.getInstance();
  const { NETWORK_ID, BLOCKCHAIN_ID, AVA_NODE_IP } = environmentVariables;
  let avalancheInstance = new Avalanche(
    AVA_NODE_IP,
    443,
    "https",
    NETWORK_ID,
    BLOCKCHAIN_ID
  );

  const [xchain] = React.useState(avalancheInstance.XChain());
  const [loading, setLoading] = React.useState(true);
  const [wallet, setWallet] = React.useState(false);
  const {
    encryptionStatus,
    encrypt,
    decrypt,
    setEncryptionStatus,
  } = useEncryption();

  const createWallet = (importMnemonic) => {
    const mnemonic = importMnemonic || bip39.generateMnemonic(256);
    const privateKey = derivePrivateKeyFromMnemonic(mnemonic);
    const keychainInstance = importedKeychainInstance(privateKey);
    const addressStrings = keychainInstance.getAddressStrings();
    return { mnemonic, address: addressStrings.pop(), avaxBalance: 0 };
  };

  const deleteWallet = () => {
    window.localStorage.removeItem("guava-wallet");
    setWallet(false);
  };

  const generateMasterKeyFromSeed = (mnemonic) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterHdKey = HDKey.fromMasterSeed(seed);
    return function getPrivateKeyBuffer(derivationPath) {
      const accountHdKey = masterHdKey.derive(`${AVA_ACCOUNT_PATH}`);
      if (!derivationPath) return accountHdKey.privateKey;
      const derivedHdKey = accountHdKey.derive(derivationPath);
      return derivedHdKey.privateKey;
    };
  };

  const derivePrivateKeyFromMnemonic = (mnemonic) => {
    const derivationPath =
      process.env.REACT_APP_ENVIRONMENT === "development" ? false : `m/0/0`;
    const getPrivateKeyBuffer = generateMasterKeyFromSeed(mnemonic);
    return getPrivateKeyBuffer(derivationPath);
  };

  const importedKeychainInstance = (privateKeyBuffer) => {
    const keychainInstance = xchain.newKeyChain();
    keychainInstance.importKey(privateKeyBuffer);
    return keychainInstance;
  };

  const getKeychainInstance = (mnemonic) => {
    const privateKeyBuffer = derivePrivateKeyFromMnemonic(mnemonic);
    return importedKeychainInstance(privateKeyBuffer);
  };

  const parseWalletFromLocalStorage = () => {
    const wallet = window.localStorage.getItem("guava-wallet");
    return JSON.parse(wallet);
  };

  const fetchAllBalancesFromAddress = async (address) => {
    let balances = await xchain.getAllBalances(address);
    const avaxBalance = balances.filter((x) => x.asset === "AVAX").pop();
    const avaxBalanceValue = avaxBalance
      ? bnToBig(avaxBalance.balance, 9).toString()
      : "0";
    return avaxBalanceValue;
  };

  const getWalletFromLocalStorage = async () => {
    const wallet = parseWalletFromLocalStorage();
    if (wallet && wallet.address) {
      const avaxBalanceValue = await fetchAllBalancesFromAddress(
        wallet.address
      );
      return { ...wallet, avaxBalance: avaxBalanceValue };
    }
  };

  const sendAssetXChain = async (amount, destinationAddress) => {
    Big.NE = -(9 - 1);
    const sendAmount = new BN(
      new Big(amount).times(Big(Math.pow(10, 9))).toString()
    );

    const addressesFromSender = [wallet.address];
    const responseFromUTXOFetch = await xchain.getUTXOs(addressesFromSender);
    const avaxAssetIDBuffer = await xchain.getAVAXAssetID();
    const keychainInstance = getKeychainInstance(wallet.mnemonic);
    const baseTransactionOptions = {
      utxoset: responseFromUTXOFetch.utxos,
      amount: sendAmount,
      assetID: avaxAssetIDBuffer,
      toAddress: destinationAddress,
      fromAddresses: addressesFromSender,
      changeAddresses: addressesFromSender,
    };

    const {
      utxoset,
      assetID,
      toAddress,
      fromAddresses,
      changeAddresses,
    } = baseTransactionOptions;
    const unsignedTransaction = await xchain.buildBaseTx(
      utxoset,
      sendAmount,
      assetID,
      [toAddress],
      fromAddresses,
      changeAddresses
    );
    const signedTransaction = unsignedTransaction.sign(keychainInstance);
    const issuedTransactionID = await xchain.issueTx(signedTransaction);
    return issuedTransactionID;
  };

  const setWalletAndEncrypt = async () => {
    const walletFromLocalStorage = await getWalletFromLocalStorage();
    if (walletFromLocalStorage && walletFromLocalStorage.mnemonicCypher) {
      setEncryptionStatus(ENCRYPTION_STATUS_CODE.ENCRYPTED);
      setWallet({ ...walletFromLocalStorage, mnemonic: false });
    }
  };

  const setExistingWalletOnFirstMount = () => {
    (async () => {
      setLoading(true);
      await setWalletAndEncrypt(true);
      setLoading(false);
    })();
  };

  useMountEffect(setExistingWalletOnFirstMount);

  useAsyncTimeout(async () => {
    try {
      const responseFromLocalStorage = await getWalletFromLocalStorage();
      if (responseFromLocalStorage) {
        if (
          wallet &&
          responseFromLocalStorage.avaxBalance !== wallet.avaxBalance
        ) {
          setWallet(responseFromLocalStorage);
        }
      }
    } catch (error) {
      notification.error({
        message: "Network Error",
        description: (
          <Paragraph>
            Connection issues with Guava Node. Try again later.
          </Paragraph>
        ),
        duration: 5,
      });
    }
  }, INTERVAL_IN_MILISECONDS);

  useAsyncTimeout(async () => {
    await setWalletAndEncrypt();
  }, INTERVAL_IN_MILISECONDS * 30);

  React.useEffect(() => {
    if (wallet) {
      window.localStorage.setItem(
        "guava-wallet",
        JSON.stringify({
          mnemonicCypher: wallet.mnemonicCypher,
          mnemonic: wallet.mnemonic,
          address: wallet.address,
          avaxBalance: wallet.avaxBalance,
        })
      );
    }
  }, [wallet]);

  return {
    sendAssetXChain,
    getWalletFromLocalStorage,
    deleteWallet,
    createWallet,
    loading,
    wallet,
    setWallet,
    tokens: [],
    encryptionStatus,
    encrypt,
    decrypt,
  };
};

export const WalletContext = React.createContext(useWallet);

export const WalletProvider = ({ children }) => {
  const walletInstance = useWallet();

  return (
    <WalletContext.Provider value={walletInstance}>
      {children}
    </WalletContext.Provider>
  );
};
