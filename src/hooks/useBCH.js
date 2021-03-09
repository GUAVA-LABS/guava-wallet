import BigNumber from 'bignumber.js';
import { currency } from '@components/Common/Ticker';
import SlpWallet from 'minimal-slp-wallet';
import { toSmallestDenomination } from '@utils/cashMethods';

export default function useBCH() {
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
                ? process.env.REACT_APP_BCHA_APIS
                : process.env.REACT_APP_BCHA_APIS_TEST;
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

    // Split out the BCH.Electrumx.utxo(addresses) call from the getSlpBalancesandUtxos function
    // If utxo set has not changed, you do not need to hydrate the utxo set
    // This drastically reduces calls to the API
    const getUtxos = async (BCH, addresses) => {
        let utxosResponse;
        try {
            //console.log(`API Call: BCH.Electrumx.utxo(addresses)`);
            //console.log(addresses);
            utxosResponse = await BCH.Electrumx.utxo(addresses);
            //console.log(`BCH.Electrumx.utxo(addresses) succeeded`);
            //console.log(`utxosResponse`, utxosResponse);
            return utxosResponse.utxos;
        } catch (err) {
            console.log(`Error in BCH.Electrumx.utxo(addresses):`);
            return err;
        }
    };

    const getHydratedUtxoDetails = async (BCH, utxos) => {
        let hydratedUtxoDetails;

        try {
            hydratedUtxoDetails = await BCH.SLP.Utils.hydrateUtxos(utxos);
            return hydratedUtxoDetails;
        } catch (err) {
            console.log(
                `Error in BCH.SLP.Utils.hydrateUtxos(utxosResponse.utxos)`,
            );
            console.log(err);
            return err;
        }
    };

    const getSlpBalancesAndUtxos = hydratedUtxoDetails => {
        const hydratedUtxos = [];
        for (let i = 0; i < hydratedUtxoDetails.slpUtxos.length; i += 1) {
            const hydratedUtxosAtAddress = hydratedUtxoDetails.slpUtxos[i];
            for (let j = 0; j < hydratedUtxosAtAddress.utxos.length; j += 1) {
                const hydratedUtxo = hydratedUtxosAtAddress.utxos[j];
                hydratedUtxo.address = hydratedUtxosAtAddress.address;
                hydratedUtxos.push(hydratedUtxo);
            }
        }

        //console.log(`hydratedUtxos`, hydratedUtxos);

        // WARNING
        // If you hit rate limits, your above utxos object will come back with `isValid` as null, but otherwise ok
        // You need to throw an error before setting nonSlpUtxos and slpUtxos in this case
        const nullUtxos = hydratedUtxos.filter(utxo => utxo.isValid === null);
        //console.log(`nullUtxos`, nullUtxos);
        if (nullUtxos.length > 0) {
            console.log(
                `${nullUtxos.length} null utxos found, ignoring results`,
            );
            throw new Error('Null utxos found, ignoring results');
        }

        // Prevent app from treating slpUtxos as nonSlpUtxos
        // Must enforce === false as api will occasionally return utxo.isValid === null
        // Do not classify utxos with 546 satoshis as nonSlpUtxos as a precaution
        // Do not classify any utxos that include token information as nonSlpUtxos
        const nonSlpUtxos = hydratedUtxos.filter(
            utxo =>
                utxo.isValid === false && utxo.value !== 546 && !utxo.tokenName,
        );
        const slpUtxos = hydratedUtxos.filter(utxo => utxo.isValid);

        let tokensById = {};

        slpUtxos.forEach(slpUtxo => {
            let token = tokensById[slpUtxo.tokenId];

            if (token) {
                // Minting baton does nto have a slpUtxo.tokenQty type

                if (slpUtxo.tokenQty) {
                    token.balance = token.balance.plus(
                        new BigNumber(slpUtxo.tokenQty),
                    );
                }

                //token.hasBaton = slpUtxo.transactionType === "genesis";
                if (slpUtxo.utxoType && !token.hasBaton) {
                    token.hasBaton = slpUtxo.utxoType === 'minting-baton';
                }

                // Examples of slpUtxo
                /*
                Genesis transaction:
                {
                address: "bitcoincash:qrhzv5t79e2afc3rdutcu0d3q20gl7ul3ue58whah6"
                decimals: 9
                height: 617564
                isValid: true
                satoshis: 546
                tokenDocumentHash: ""
                tokenDocumentUrl: "developer.bitcoin.com"
                tokenId: "6c41f244676ecfcbe3b4fabee2c72c2dadf8d74f8849afabc8a549157db69199"
                tokenName: "PiticoLaunch"
                tokenTicker: "PTCL"
                tokenType: 1
                tx_hash: "6c41f244676ecfcbe3b4fabee2c72c2dadf8d74f8849afabc8a549157db69199"
                tx_pos: 2
                txid: "6c41f244676ecfcbe3b4fabee2c72c2dadf8d74f8849afabc8a549157db69199"
                utxoType: "minting-baton"
                value: 546
                vout: 2
                }

                Send transaction:
                {
                address: "bitcoincash:qrhzv5t79e2afc3rdutcu0d3q20gl7ul3ue58whah6"
                decimals: 9
                height: 655115
                isValid: true
                satoshis: 546
                tokenDocumentHash: ""
                tokenDocumentUrl: "developer.bitcoin.com"
                tokenId: "6c41f244676ecfcbe3b4fabee2c72c2dadf8d74f8849afabc8a549157db69199"
                tokenName: "PiticoLaunch"
                tokenQty: 1.123456789
                tokenTicker: "PTCL"
                tokenType: 1
                transactionType: "send"
                tx_hash: "dea400f963bc9f51e010f88533010f8d1f82fc2bcc485ff8500c3a82b25abd9e"
                tx_pos: 1
                txid: "dea400f963bc9f51e010f88533010f8d1f82fc2bcc485ff8500c3a82b25abd9e"
                utxoType: "token"
                value: 546
                vout: 1
                }
                */
            } else {
                token = {};
                token.info = slpUtxo;
                token.tokenId = slpUtxo.tokenId;
                if (slpUtxo.tokenQty) {
                    token.balance = new BigNumber(slpUtxo.tokenQty);
                } else {
                    token.balance = new BigNumber(0);
                }
                if (slpUtxo.utxoType) {
                    token.hasBaton = slpUtxo.utxoType === 'minting-baton';
                } else {
                    token.hasBaton = false;
                }

                tokensById[slpUtxo.tokenId] = token;
            }
        });

        const tokens = Object.values(tokensById);
        // console.log(`tokens`, tokens);
        return {
            tokens,
            nonSlpUtxos,
            slpUtxos,
        };
    };

    const calcFee = (
        BCH,
        utxos,
        p2pkhOutputNumber = 2,
        satoshisPerByte = currency.defaultFee,
    ) => {
        const byteCount = BCH.BitcoinCash.getByteCount(
            { P2PKH: utxos.length },
            { P2PKH: p2pkhOutputNumber },
        );
        const txFee = Math.ceil(satoshisPerByte * byteCount);
        return txFee;
    };

    const sendToken = async (
        BCH,
        wallet,
        slpBalancesAndUtxos,
        { tokenId, amount, tokenReceiverAddress },
    ) => {
        // Handle error of user having no BCH
        if (slpBalancesAndUtxos.nonSlpUtxos.length === 0) {
            throw new Error(
                `You need some ${currency.ticker} to send ${currency.tokenTicker}`,
            );
        }
        const largestBchUtxo = slpBalancesAndUtxos.nonSlpUtxos.reduce(
            (previous, current) =>
                previous.value > current.value ? previous : current,
        );

        const bchECPair = BCH.ECPair.fromWIF(largestBchUtxo.wif);
        const tokenUtxos = slpBalancesAndUtxos.slpUtxos.filter(
            (utxo, index) => {
                if (
                    utxo && // UTXO is associated with a token.
                    utxo.tokenId === tokenId && // UTXO matches the token ID.
                    utxo.utxoType === 'token' // UTXO is not a minting baton.
                ) {
                    return true;
                }
                return false;
            },
        );

        if (tokenUtxos.length === 0) {
            throw new Error(
                'No token UTXOs for the specified token could be found.',
            );
        }

        // BEGIN transaction construction.

        // instance of transaction builder
        let transactionBuilder;
        if (process.env.REACT_APP_NETWORK === 'mainnet') {
            transactionBuilder = new BCH.TransactionBuilder();
        } else transactionBuilder = new BCH.TransactionBuilder('testnet');

        const originalAmount = largestBchUtxo.value;
        transactionBuilder.addInput(
            largestBchUtxo.tx_hash,
            largestBchUtxo.tx_pos,
        );

        let finalTokenAmountSent = new BigNumber(0);
        let tokenAmountBeingSentToAddress = new BigNumber(amount);

        let tokenUtxosBeingSpent = [];
        for (let i = 0; i < tokenUtxos.length; i++) {
            finalTokenAmountSent = finalTokenAmountSent.plus(
                new BigNumber(tokenUtxos[i].tokenQty),
            );
            transactionBuilder.addInput(
                tokenUtxos[i].tx_hash,
                tokenUtxos[i].tx_pos,
            );
            tokenUtxosBeingSpent.push(tokenUtxos[i]);
            if (tokenAmountBeingSentToAddress.lte(finalTokenAmountSent)) {
                break;
            }
        }

        const slpSendObj = BCH.SLP.TokenType1.generateSendOpReturn(
            tokenUtxosBeingSpent,
            tokenAmountBeingSentToAddress.toString(),
        );

        const slpData = slpSendObj.script;

        // Add OP_RETURN as first output.
        transactionBuilder.addOutput(slpData, 0);

        // Send dust transaction representing tokens being sent.
        transactionBuilder.addOutput(
            BCH.SLP.Address.toLegacyAddress(tokenReceiverAddress),
            546,
        );

        // Return any token change back to the sender.
        if (slpSendObj.outputs > 1) {
            // Try to send this to Path1899 to move all utxos off legacy addresses
            if (wallet.Path1899.legacyAddress) {
                transactionBuilder.addOutput(
                    wallet.Path1899.legacyAddress,
                    546,
                );
            } else {
                // If you can't, send it back from whence it came

                transactionBuilder.addOutput(
                    BCH.SLP.Address.toLegacyAddress(
                        tokenUtxosBeingSpent[0].address,
                    ),
                    546,
                );
            }
        }

        // get byte count to calculate fee. paying 1 sat
        // Note: This may not be totally accurate. Just guessing on the byteCount size.
        const txFee = calcFee(
            BCH,
            tokenUtxosBeingSpent,
            5,
            1.1 * currency.defaultFee,
        );

        // amount to send back to the sending address. It's the original amount - 1 sat/byte for tx size
        const remainder = originalAmount - txFee - 546 * 2;
        if (remainder < 1) {
            throw new Error('Selected UTXO does not have enough satoshis');
        }

        // Last output: send the BCH change back to the wallet.
        // If Path1899, send it to Path1899 address
        if (wallet.Path1899.legacyAddress) {
            transactionBuilder.addOutput(
                wallet.Path1899.legacyAddress,
                remainder,
            );
        } else {
            // Otherwise send it back from whence it came
            transactionBuilder.addOutput(
                BCH.Address.toLegacyAddress(largestBchUtxo.address),
                remainder,
            );
        }

        // Sign the transaction with the private key for the BCH UTXO paying the fees.
        let redeemScript;
        transactionBuilder.sign(
            0,
            bchECPair,
            redeemScript,
            transactionBuilder.hashTypes.SIGHASH_ALL,
            originalAmount,
        );

        // Sign each token UTXO being consumed.
        for (let i = 0; i < tokenUtxosBeingSpent.length; i++) {
            const thisUtxo = tokenUtxosBeingSpent[i];
            const accounts = [wallet.Path245, wallet.Path145, wallet.Path1899];
            const utxoEcPair = BCH.ECPair.fromWIF(
                accounts
                    .filter(acc => acc.cashAddress === thisUtxo.address)
                    .pop().fundingWif,
            );

            transactionBuilder.sign(
                1 + i,
                utxoEcPair,
                redeemScript,
                transactionBuilder.hashTypes.SIGHASH_ALL,
                thisUtxo.value,
            );
        }

        // build tx
        const tx = transactionBuilder.build();

        // output rawhex
        const hex = tx.toHex();
        // console.log(`Transaction raw hex: `, hex);

        // END transaction construction.

        const txidStr = await BCH.RawTransactions.sendRawTransaction([hex]);
        if (txidStr && txidStr[0]) {
            console.log(`${currency.tokenTicker} txid`, txidStr[0]);
        }

        let link;
        if (process.env.REACT_APP_NETWORK === `mainnet`) {
            link = `${currency.blockExplorerUrl}/tx/${txidStr}`;
        } else {
            link = `${currency.blockExplorerUrlTestnet}/tx/${txidStr}`;
        }

        //console.log(`link`, link);

        return link;
    };

    const sendBch = async (
        BCH,
        wallet,
        utxos,
        destinationAddress,
        sendAmount,
        feeInSatsPerByte,
        callbackTxId,
        encodedOpReturn,
    ) => {
        // Note: callbackTxId is a callback function that accepts a txid as its only parameter

        try {
            if (!sendAmount) {
                return null;
            }

            const value = new BigNumber(sendAmount);

            // If user is attempting to send less than minimum accepted by the backend
            if (value.lt(new BigNumber(currency.dust))) {
                // Throw the same error given by the backend attempting to broadcast such a tx
                throw new Error('dust');
            }
            const REMAINDER_ADDR = wallet.Path1899.cashAddress;
            const inputUtxos = [];
            let transactionBuilder;

            // instance of transaction builder
            if (process.env.REACT_APP_NETWORK === `mainnet`)
                transactionBuilder = new BCH.TransactionBuilder();
            else transactionBuilder = new BCH.TransactionBuilder('testnet');

            const satoshisToSend = toSmallestDenomination(value);

            // Throw validation error if toSmallestDenomination returns false
            if (!satoshisToSend) {
                const error = new Error(
                    `Invalid decimal places for send amount`,
                );
                throw error;
            }
            let originalAmount = new BigNumber(0);
            let txFee = 0;
            for (let i = 0; i < utxos.length; i++) {
                const utxo = utxos[i];
                originalAmount = originalAmount.plus(utxo.value);
                const vout = utxo.vout;
                const txid = utxo.txid;
                // add input with txid and index of vout
                transactionBuilder.addInput(txid, vout);

                inputUtxos.push(utxo);
                txFee = encodedOpReturn
                    ? calcFee(BCH, inputUtxos, 3, feeInSatsPerByte)
                    : calcFee(BCH, inputUtxos, 2, feeInSatsPerByte);

                if (originalAmount.minus(satoshisToSend).minus(txFee).gte(0)) {
                    break;
                }
            }

            // amount to send back to the remainder address.
            const remainder = originalAmount.minus(satoshisToSend).minus(txFee);

            if (remainder.lt(0)) {
                const error = new Error(`Insufficient funds`);
                error.code = SEND_BCH_ERRORS.INSUFFICIENT_FUNDS;
                throw error;
            }

            if (encodedOpReturn) {
                transactionBuilder.addOutput(encodedOpReturn, 0);
            }

            // add output w/ address and amount to send
            transactionBuilder.addOutput(
                BCH.Address.toCashAddress(destinationAddress),
                parseInt(toSmallestDenomination(value)),
            );

            if (
                remainder.gte(
                    toSmallestDenomination(new BigNumber(currency.dust)),
                )
            ) {
                transactionBuilder.addOutput(
                    REMAINDER_ADDR,
                    parseInt(remainder),
                );
            }

            // Sign the transactions with the HD node.
            for (let i = 0; i < inputUtxos.length; i++) {
                const utxo = inputUtxos[i];
                transactionBuilder.sign(
                    i,
                    BCH.ECPair.fromWIF(utxo.wif),
                    undefined,
                    transactionBuilder.hashTypes.SIGHASH_ALL,
                    utxo.value,
                );
            }

            // build tx
            const tx = transactionBuilder.build();
            // output rawhex
            const hex = tx.toHex();

            // Broadcast transaction to the network
            const txidStr = await BCH.RawTransactions.sendRawTransaction([hex]);

            if (txidStr && txidStr[0]) {
                console.log(`${currency.ticker} txid`, txidStr[0]);
            }
            let link;

            if (callbackTxId) {
                callbackTxId(txidStr);
            }
            if (process.env.REACT_APP_NETWORK === `mainnet`) {
                link = `${currency.blockExplorerUrl}/tx/${txidStr}`;
            } else {
                link = `${currency.blockExplorerUrlTestnet}/tx/${txidStr}`;
            }
            //console.log(`link`, link);

            return link;
        } catch (err) {
            if (err.error === 'insufficient priority (code 66)') {
                err.code = SEND_BCH_ERRORS.INSUFFICIENT_PRIORITY;
            } else if (err.error === 'txn-mempool-conflict (code 18)') {
                err.code = SEND_BCH_ERRORS.DOUBLE_SPENDING;
            } else if (err.error === 'Network Error') {
                err.code = SEND_BCH_ERRORS.NETWORK_ERROR;
            } else if (
                err.error ===
                'too-long-mempool-chain, too many unconfirmed ancestors [limit: 25] (code 64)'
            ) {
                err.code = SEND_BCH_ERRORS.MAX_UNCONFIRMED_TXS;
            }
            console.log(`error: `, err);
            throw err;
        }
    };

    const getBCH = (apiIndex = 0) => {
        let ConstructedSlpWallet;

        ConstructedSlpWallet = new SlpWallet('', {
            restURL: getRestUrl(apiIndex),
        });
        return ConstructedSlpWallet.bchjs;
    };

    return {
        getBCH,
        calcFee,
        getUtxos,
        getHydratedUtxoDetails,
        getSlpBalancesAndUtxos,
        getTxHistory,
        getRestUrl,
        sendBch,
        sendToken,
    };
}
