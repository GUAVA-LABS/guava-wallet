import React from 'react';
import {
    Avalanche,
    BinTools,
    Buffer,
    BN
  } from "avalanche";

const useWallet = () => {
    let bintools = BinTools.getInstance();
    
    let myNetworkID = 12345; //default is 3, we want to override that for our local network
    let myBlockchainID = "26sSDdFXoKeShAqVfvugUiUQKhMZtHYDLeBqmBfNfcdjziTrZA"; // The X-Chain blockchainID on this network
    let ava = new Avalanche("localhost", 9650, "http", myNetworkID, myBlockchainID);
    let xchain = ava.XChain(); //returns a reference to the X-Chain used by AvalancheJS
    console.log('xchain', {xchain});
    return {
        wallet: xchain,
        tokens: [],
    }
}

export const WalletContext = React.createContext(useWallet);

export const WalletProvider = ({ children }) => {
    const wallet = useWallet();
    return (
        <WalletContext.Provider value={wallet}>
            {children}
        </WalletContext.Provider>
    );
};
