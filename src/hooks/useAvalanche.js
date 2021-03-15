import {
    Avalanche,
    BinTools,
    Buffer,
    BN
  } from "avalanche";

export default function useAvalanche() {
    let myNetworkID = 1; //default is 3, we want to override that for our local network
    let myBlockchainID = "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM"; // The X-Chain blockchainID on this network
    let avax = new Avalanche("localhost", 9650, "http", myNetworkID, myBlockchainID);
    let xchain = avax.XChain(); //returns a reference to the X-Chain used by AvalancheJS

    const SEND_BCH_ERRORS = {
        INSUFFICIENT_FUNDS: 0,
        NETWORK_ERROR: 1,
        INSUFFICIENT_PRIORITY: 66, // ~insufficient fee
        DOUBLE_SPENDING: 18,
        MAX_UNCONFIRMED_TXS: 64,
    };

    const getRestUrl = (apiIndex = 0) => {
        const apiString =
            process.env.REACT_APP_NETWORK === `mainnet`
                ? process.env.REACT_APP_AVALANCHE_NODE
                : process.env.REACT_APP_AVALANCHE_TEST_NODE;
        const apiArray = apiString.split(',');
        return apiArray[apiIndex];
    };

    const getTxHistory = async (BCH, addresses) => {
        let txHistoryResponse;
        try {
            //console.log(`API Call: BCH.Electrumx.utxo(addresses)`);
            //console.log(addresses);
            txHistoryResponse = await BCH.Electrumx.transactions(addresses);
            //console.log(`BCH.Electrumx.transactions(addresses) succeeded`);
            //console.log(`txHistoryResponse`, txHistoryResponse);
            if (txHistoryResponse.success && txHistoryResponse.transactions) {
                return txHistoryResponse.transactions;
            } else {
                // eslint-disable-next-line no-throw-literal
                throw new Error('Error in getTxHistory');
            }
        } catch (err) {
            console.log(`Error in BCH.Electrumx.transactions(addresses):`);
            console.log(err);
            return err;
        }
    };

    // Get UTXOs on X-Chain
    const getUtxos = async () => {
        try {
            let myAddresses = xchain.keyChain().getAddresses(); //returns an array of addresses the KeyChain manages
            let addressStrings = xchain.keyChain().getAddressStrings(); //returns an array of addresses the KeyChain manages as strings
            let utxos = (await xchain.getUTXOs(myAddresses)).utxos;
            return utxos;
        } catch (err) {
            console.log(`Error in xchain.getUTXOs(addresses):`);
            return err;
        }
    };


    return {
        getUtxos,
        getTxHistory,
        getRestUrl,
    };
}
