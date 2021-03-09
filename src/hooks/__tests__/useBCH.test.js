/* eslint-disable no-native-reassign */
import useBCH from '../useBCH';
import mockReturnGetHydratedUtxoDetails from '../__mocks__/mockReturnGetHydratedUtxoDetails';
import mockReturnGetSlpBalancesAndUtxos from '../__mocks__/mockReturnGetSlpBalancesAndUtxos';
import sendBCHMock from '../__mocks__/sendBCH';
import BCHJS from '@psf/bch-js'; // TODO: should be removed when external lib not needed anymore
import { currency } from '../../components/Common/Ticker';
import BigNumber from 'bignumber.js';

describe('useBCH hook', () => {
    it('gets Rest Api Url on testnet', () => {
        process = {
            env: {
                REACT_APP_NETWORK: `testnet`,
                REACT_APP_BCHA_APIS:
                    'https://rest.kingbch.com/v3/,https://wallet-service-prod.bitframe.org/v3/,notevenaurl,https://rest.kingbch.com/v3/',
                REACT_APP_BCHA_APIS_TEST:
                    'https://free-test.fullstack.cash/v3/',
            },
        };
        const { getRestUrl } = useBCH();
        const expectedApiUrl = `https://free-test.fullstack.cash/v3/`;
        expect(getRestUrl(0)).toBe(expectedApiUrl);
    });

    it('gets primary Rest API URL on mainnet', () => {
        process = {
            env: {
                REACT_APP_BCHA_APIS:
                    'https://rest.kingbch.com/v3/,https://wallet-service-prod.bitframe.org/v3/,notevenaurl,https://rest.kingbch.com/v3/',
                REACT_APP_NETWORK: 'mainnet',
            },
        };
        const { getRestUrl } = useBCH();
        const expectedApiUrl = `https://rest.kingbch.com/v3/`;
        expect(getRestUrl(0)).toBe(expectedApiUrl);
    });

    it('calculates fee correctly for 2 P2PKH outputs', () => {
        const { calcFee } = useBCH();
        const BCH = new BCHJS();
        const utxosMock = [{}, {}];

        expect(calcFee(BCH, utxosMock, 2, 1.01)).toBe(378);
    });

    it('gets SLP and BCH balances and utxos from hydrated utxo details', async () => {
        const { getSlpBalancesAndUtxos } = useBCH();

        const result = await getSlpBalancesAndUtxos(
            mockReturnGetHydratedUtxoDetails,
        );

        expect(result).toStrictEqual(mockReturnGetSlpBalancesAndUtxos);
    });

    it('sends BCH correctly', async () => {
        const { sendBch } = useBCH();
        const BCH = new BCHJS();
        const {
            expectedTxId,
            expectedHex,
            utxos,
            wallet,
            destinationAddress,
            sendAmount,
        } = sendBCHMock;

        BCH.RawTransactions.sendRawTransaction = jest
            .fn()
            .mockResolvedValue(expectedTxId);
        expect(
            await sendBch(
                BCH,
                wallet,
                utxos,
                destinationAddress,
                sendAmount,
                1.01,
            ),
        ).toBe(`${currency.blockExplorerUrl}/tx/${expectedTxId}`);
        expect(BCH.RawTransactions.sendRawTransaction).toHaveBeenCalledWith(
            expectedHex,
        );
    });

    it('sends BCH correctly with callback', async () => {
        const { sendBch } = useBCH();
        const BCH = new BCHJS();
        const callback = jest.fn();
        const {
            expectedTxId,
            expectedHex,
            utxos,
            wallet,
            destinationAddress,
            sendAmount,
        } = sendBCHMock;

        BCH.RawTransactions.sendRawTransaction = jest
            .fn()
            .mockResolvedValue(expectedTxId);
        expect(
            await sendBch(
                BCH,
                wallet,
                utxos,
                destinationAddress,
                sendAmount,
                1.01,
                callback,
            ),
        ).toBe(`${currency.blockExplorerUrl}/tx/${expectedTxId}`);
        expect(BCH.RawTransactions.sendRawTransaction).toHaveBeenCalledWith(
            expectedHex,
        );
        expect(callback).toHaveBeenCalledWith(expectedTxId);
    });

    it(`Throws error if called trying to send one base unit ${currency.ticker} more than available in utxo set`, async () => {
        const { sendBch } = useBCH();
        const BCH = new BCHJS();
        const { expectedTxId, utxos, wallet, destinationAddress } = sendBCHMock;

        const expectedTxFeeInSats = 229;

        BCH.RawTransactions.sendRawTransaction = jest
            .fn()
            .mockResolvedValue(expectedTxId);
        const oneBaseUnitMoreThanBalance = new BigNumber(utxos[0].value)
            .minus(expectedTxFeeInSats)
            .plus(1)
            .div(10 ** currency.cashDecimals)
            .toString();

        const failedSendBch = sendBch(
            BCH,
            wallet,
            utxos,
            destinationAddress,
            oneBaseUnitMoreThanBalance,
            1.01,
        );
        expect(failedSendBch).rejects.toThrow(new Error('Insufficient funds'));
        const nullValuesSendBch = await sendBch(
            BCH,
            wallet,
            utxos,
            destinationAddress,
            null,
            1.01,
        );
        expect(nullValuesSendBch).toBe(null);
    });

    it('Throws error on attempt to send one satoshi less than backend dust limit', async () => {
        const { sendBch } = useBCH();
        const BCH = new BCHJS();
        const { expectedTxId, utxos, wallet, destinationAddress } = sendBCHMock;
        BCH.RawTransactions.sendRawTransaction = jest
            .fn()
            .mockResolvedValue(expectedTxId);
        const failedSendBch = sendBch(
            BCH,
            wallet,
            utxos,
            destinationAddress,
            new BigNumber(currency.dust)
                .minus(new BigNumber('0.00000001'))
                .toString(),
            1.01,
        );
        expect(failedSendBch).rejects.toThrow(new Error('dust'));
        const nullValuesSendBch = await sendBch(
            BCH,
            wallet,
            utxos,
            destinationAddress,
            null,
            1.01,
        );
        expect(nullValuesSendBch).toBe(null);
    });

    it('receives errors from the network and parses it', async () => {
        const { sendBch } = useBCH();
        const BCH = new BCHJS();
        const { sendAmount, utxos, wallet, destinationAddress } = sendBCHMock;
        BCH.RawTransactions.sendRawTransaction = jest
            .fn()
            .mockImplementation(async () => {
                throw new Error('insufficient priority (code 66)');
            });
        const insufficientPriority = sendBch(
            BCH,
            wallet,
            utxos,
            destinationAddress,
            sendAmount,
            1.01,
        );
        await expect(insufficientPriority).rejects.toThrow(
            new Error('insufficient priority (code 66)'),
        );

        BCH.RawTransactions.sendRawTransaction = jest
            .fn()
            .mockImplementation(async () => {
                throw new Error('txn-mempool-conflict (code 18)');
            });
        const txnMempoolConflict = sendBch(
            BCH,
            wallet,
            utxos,
            destinationAddress,
            sendAmount,
            1.01,
        );
        await expect(txnMempoolConflict).rejects.toThrow(
            new Error('txn-mempool-conflict (code 18)'),
        );

        BCH.RawTransactions.sendRawTransaction = jest
            .fn()
            .mockImplementation(async () => {
                throw new Error('Network Error');
            });
        const networkError = sendBch(
            BCH,
            wallet,
            utxos,
            destinationAddress,
            sendAmount,
            1.01,
        );
        await expect(networkError).rejects.toThrow(new Error('Network Error'));

        BCH.RawTransactions.sendRawTransaction = jest
            .fn()
            .mockImplementation(async () => {
                const err = new Error(
                    'too-long-mempool-chain, too many unconfirmed ancestors [limit: 25] (code 64)',
                );
                throw err;
            });

        const tooManyAncestorsMempool = sendBch(
            BCH,
            wallet,
            utxos,
            destinationAddress,
            sendAmount,
            1.01,
        );
        await expect(tooManyAncestorsMempool).rejects.toThrow(
            new Error(
                'too-long-mempool-chain, too many unconfirmed ancestors [limit: 25] (code 64)',
            ),
        );
    });
});
