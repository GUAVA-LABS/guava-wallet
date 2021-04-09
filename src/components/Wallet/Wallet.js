import React from 'react';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import { WalletContext } from '@utils/context';
import { OnBoarding } from '@components/OnBoarding/OnBoarding';
import { QRCode } from '@components/Common/QRCode';
import { Link } from 'react-router-dom';

export const LoadingCtn = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    flex-direction: column;

    svg {
        width: 50px;
        height: 50px;
        fill: #ff8d00;
    }
`;

export const BalanceHeader = styled.div`
    color: #444;
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    @media (max-width: 768px) {
        font-size: 23px;
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
    margin-bottom: 5px;
`;

export const SwitchBtnCtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    margin-bottom: 15px;
    .nonactiveBtn {
        color: #444;
        background: linear-gradient(145deg, #eeeeee, #c8c8c8) !important;
        box-shadow: none !important;
    }
    .slpActive {
        background: #D5008C !important;
        box-shadow: inset 5px 5px 11px #4e9d5a, inset -5px -5px 11px #6edd80 !important;
    }
`;

export const SwitchBtn = styled.div`
    font-weight: bold;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-size: 14px;
    padding: 6px 0;
    width: 100px;
    margin: 0 1px;
    text-decoration: none;
    background: #D5008C;
    box-shadow: inset 8px 8px 16px #d67600, inset -8px -8px 16px #ffa400;
    user-select: none;
    :first-child {
        border-radius: 100px 0 0 100px;
    }
    :nth-child(2) {
        border-radius: 0 100px 100px 0;
    }
`;

export const Links = styled(Link)`
    color: #444;
    width: 100%;
    font-size: 16px;
    margin: 10px 0 20px 0;
    border: 1px solid #444;
    padding: 14px 0;
    display: inline-block;
    border-radius: 3px;
    transition: all 200ms ease-in-out;
    svg {
        fill: #444;
    }
    :hover {
        color: #ff8d00;
        border-color: #ff8d00;
        svg {
            fill: #444;
        }
    }
    @media (max-width: 768px) {
        padding: 10px 0;
        font-size: 14px;
    }
`;

export const ExternalLink = styled.a`
    color: #444;
    width: 100%;
    font-size: 16px;
    margin: 0 0 20px 0;
    border: 1px solid #444;
    padding: 14px 0;
    display: inline-block;
    border-radius: 3px;
    transition: all 200ms ease-in-out;
    svg {
        fill: #444;
        transition: all 200ms ease-in-out;
    }
    :hover {
        color: #ff8d00;
        border-color: #ff8d00;
        svg {
            fill: #ff8d00;
        }
    }
    @media (max-width: 768px) {
        padding: 10px 0;
        font-size: 14px;
    }
`;

const WalletInfo = () => {
    const ContextValue = React.useContext(WalletContext);
    const { wallet } = ContextValue;
    const { address } = wallet;
    return (
      
           <>
            <h1>{wallet.avaxBalance ? wallet.avaxBalance : 0} AVAX</h1>
            {address && <>
                      
                            <QRCode
                                id="borderedQRCode"
                                address={
                                    address
                                }
                            />
                        
                    </>
                }
        </>
    );
};

const Wallet = () => {
    const ContextValue = React.useContext(WalletContext);
    const { wallet, loading } = ContextValue;

    return (
        <>
            {loading && (
                <LoadingCtn>
                    <LoadingOutlined />
                </LoadingCtn>
            )}
            {!loading && wallet && <WalletInfo />}
         
            {!loading && !wallet ? <OnBoarding /> : null}
        </>
    );
};

export default Wallet;
