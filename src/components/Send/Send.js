import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WalletContext } from '@utils/context';
import { Form, notification, message, Spin, Modal, Alert } from 'antd';
import { CashLoader, CashLoadingIcon } from '@components/Common/CustomIcons';
import { Row, Col } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import PrimaryButton, {
    SecondaryButton,
} from '@components/Common/PrimaryButton';
import {
    SendBchInput,
    FormItemWithQRCodeAddon,
} from '@components/Common/EnhancedInputs';
import useWindowDimensions from '@hooks/useWindowDimensions';
import { isMobile, isIOS, isSafari } from 'react-device-detect';
import {
    currency,
} from '@components/Common/Ticker.js';
import { shouldRejectAmountInput, fiatToCrypto } from '@utils/validation';
import FormPassword from '@components/OnBoarding/formPassword';
import useAsyncTimeout from '@hooks/useAsyncTimeout';
import axios from 'axios';

export const BalanceHeader = styled.div`
    p {
        color: #444;
        width: 100%;
        font-size: 14px;
        margin-bottom: 0px;
    }

    h3 {
        color: #444;
        width: 100%;
        font-size: 26px;
        font-weight: bold;
        margin-bottom: 0px;
    }
`;

export const BalanceHeaderFiat = styled.div`
    color: #444;
    width: 100%;
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: bold;
    @media (max-width: 768px) {
        font-size: 16px;
    }
`;

export const ZeroBalanceHeader = styled.div`
    color: #444;
    width: 100%;
    font-size: 14px;
    margin-bottom: 20px;
`;

const ConvertAmount = styled.div`
    color: #D5008C;
    width: 100%;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: bold;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const NetworkFee = styled.p`
   margin: 0;
`;

const SendBCH = ({ filledAddress, callbackTxId }) => {
    const {
        wallet,
        sendAssetXChain,
        apiError,
        txFee,
    } = React.useContext(WalletContext);

    const { avaxBalance } = wallet;
    const [fiatPrice, setFiatPrice] = React.useState(0);
    const [loadingFiatPrice, setLoadingFiatPrice] = React.useState(true);
    const INTERVAL_IN_MILISECONDS = 1000;

    const fetchFiatPrice = async () => {
        const fetchedPriceObject= await axios.get(currency.priceApi);
        setFiatPrice(fetchedPriceObject.data["usd"]);
	setLoadingFiatPrice(false);
    };

    
    const { width } = useWindowDimensions();
    const scannerSupported = width < 769 && isMobile && !(isIOS && !isSafari);


    useAsyncTimeout(async () => {
        await fetchFiatPrice();
    }, INTERVAL_IN_MILISECONDS);

    const [formData, setFormData] = useState({
        dirty: true,
        value: '',
        address: filledAddress || '',
    });

    const [loading, setLoading] = useState(false);
    const [queryStringText] = useState(null);
    const [sendAvaxAddressError] = useState(false);
    const [sendAvaxAmountError, setSendAvaxAmountError] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(currency.ticker);
    const [txInfoFromUrl, setTxInfoFromUrl] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        submit();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {

        if (
            !window.location ||
            !window.location.hash ||
            window.location.hash === '#/send'
        ) {
            return;
        }

        const txInfoArr = window.location.hash.split('?')[1].split('&');

        // Iterate over this to create object
        const txInfo = {};
        for (let i = 0; i < txInfoArr.length; i += 1) {
            let txInfoKeyValue = txInfoArr[i].split('=');
            let key = txInfoKeyValue[0];
            let value = txInfoKeyValue[1];
            txInfo[key] = value;
        }
        setTxInfoFromUrl(txInfo);
        populateFormsFromUrl(txInfo);
    }, []);

    function populateFormsFromUrl(txInfo) {
        if (txInfo && txInfo.address && txInfo.value) {
            setFormData({ address: txInfo.address, value: txInfo.value });
        }
    }

    async function submit() {
        setFormData({
            ...formData,
            dirty: false,
        });

        if (
            !formData.address ||
            !formData.value ||
            Number(formData.value) <= 0
        ) {
            return;
        }

        let avaxAmount;
        setLoading(true);
        const { address, value } = formData;
        avaxAmount = value;
        if (selectedCurrency === 'USD') {
            avaxAmount = fiatToCrypto(value, fiatPrice).toString();
        }
        try {
            const link = await sendAssetXChain(avaxAmount, address);
            console.log('txid', link);
            notification.success({
                message: 'Success',
                description: (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <Paragraph>
                            Transaction successful.
                        </Paragraph>
                    </a>
                ),
                duration: 5,
            });
            setLoading(false)

        } catch (e) {
            console.log(e);
            // Set loading to false here as well, as balance may not change depending on where error occured in try loop
            setLoading(false);
            let message;

            if (!e.error && !e.message) {
                message = `Transaction failed: no response from node.`;
            } else if (
                /Could not communicate with full node or other external service/.test(
                    e.error,
                )
            ) {
                message = 'Could not communicate with API. Please try again.';
            } else if (
                e.error &&
                e.error.includes(
                    'too-long-mempool-chain, too many unconfirmed ancestors [limit: 50] (code 64)',
                )
            ) {
                message = `The ${currency.ticker} you are trying to send has too many unconfirmed ancestors to send (limit 50). Sending will be possible after a block confirmation. Try again in about 10 minutes.`;
            } else {
                message = e.message || e.error || JSON.stringify(e);
            }

            notification.error({
                message: 'Error',
                description: message,
                duration: 5,
            });
            console.error(e);
        }
    }

    const handleAddressChange = e => {
        const { value, name } = e.target;

        setFormData(p => ({
            ...p,
            [name]: value,
        }));
    };

    const handleSelectedCurrencyChange = e => {
        setSelectedCurrency(e);
        setFormData(p => ({ ...p, value: '' }));
    };

    const handleBchAmountChange = e => {
        const { value, name } = e.target;
        let bchValue = value;
        const error = shouldRejectAmountInput(
            bchValue,
            selectedCurrency,
            fiatPrice,
            avaxBalance,
        );
        setSendAvaxAmountError(error);

        setFormData(p => ({ ...p, [name]: value }));
    };

    const showFiatPrice = avaxBalance => !loadingFiatPrice && <span>{(fiatPrice * avaxBalance).toFixed(2)}</span>;

    return (
        <>
                {!avaxBalance ? (
                    <ZeroBalanceHeader>
                        You currently have 0 {currency.ticker}
                        <br />
                        Deposit some funds to use this feature
                    </ZeroBalanceHeader>
                ) : (
                    <>
                        <BalanceHeader>
                            <p>Available balance</p>
                            <h3>
                                {avaxBalance}{' '}
                                {currency.ticker}
				
                            </h3>
			    <p>({showFiatPrice(avaxBalance)} USD)</p>
                        </BalanceHeader>
                    
                    </>
                )}

                <Row type="flex">
                    <Col span={24}>
                        <Spin spinning={loading} indicator={CashLoadingIcon}>
                            <Form style={{ width: 'auto' }}>
                                <FormItemWithQRCodeAddon
                                    loadWithCameraOpen={scannerSupported}
                                    disabled={Boolean(filledAddress)}
                                    validateStatus={''
                                    }
                                    help={
                                        sendAvaxAddressError
                                            ? sendAvaxAddressError
                                            : ''
                                    }
                                    onScan={result =>
                                        handleAddressChange({
                                            target: {
                                                name: 'address',
                                                value: result,
                                            },
                                        })
                                    }
                                    inputProps={{
                                        disabled: Boolean(filledAddress),
                                        placeholder: `${currency.ticker} Address`,
                                        name: 'address',
                                        onChange: e => handleAddressChange(e),
                                        required: true,
                                        value: filledAddress || formData.address,
                                    }}
                                ></FormItemWithQRCodeAddon>
                                <SendBchInput
                                    onMax={() => setFormData({
                                    ...formData,
                                            value: avaxBalance,
                                    })}
                                    validateStatus={
                                        sendAvaxAmountError ? 'error' : ''
                                    }
                                    help={
                                        sendAvaxAmountError ? sendAvaxAmountError : ''
                                    }
                                
                                    inputProps={{
                                        name: 'value',
                                        dollar: 0,
                                        placeholder: 'Amount',
                                        onChange: e => handleBchAmountChange(e),
                                        required: true,
                                        value: formData.value,
                                    }}
                                    selectProps={{
                                        value: selectedCurrency,
                                        disabled: queryStringText !== null,
                                        onChange: e =>
                                            handleSelectedCurrencyChange(e),
                                    }}
                                ></SendBchInput>
                                <NetworkFee>Network Fee: {txFee ? txFee : ''}</NetworkFee>
                            
                                <div style={{ paddingTop: '12px' }}>
                                    {!avaxBalance ||
                                    apiError ||
                                    sendAvaxAmountError ||
                                    sendAvaxAddressError ? (
                                        <SecondaryButton>Send</SecondaryButton>
                                    ) : (
                                        <>
                                            {txInfoFromUrl ? (
                                                <PrimaryButton
                                                    onClick={() => showModal()}
                                                >
                                                    Send
                                                </PrimaryButton>
                                            ) : (
                                                <PrimaryButton
                                                    onClick={() => submit()}
                                                >
                                                    Send
                                                </PrimaryButton>
                                            )}
                                        </>
                                    )}
                                </div>
                                {queryStringText && (
                                    <Alert
                                        message={`You are sending a transaction to an address including query parameters "${queryStringText}." Only the "amount" parameter, in units of ${currency.ticker} satoshis, is currently supported.`}
                                        type="warning"
                                    />
                                )}
                                {apiError && (
                                    <>
                                        <CashLoader />
                                        <p style={{ color: 'red' }}>
                                            <b>
                                                An error occured on our end.
                                                Reconnecting...
                                            </b>
                                        </p>
                                    </>
                                )}
                            </Form>
                        </Spin>
                    </Col>
                </Row>
        </>
    );
};

export default SendBCH;
