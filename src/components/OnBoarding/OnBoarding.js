import React, { useState } from 'react';
import styled from 'styled-components';
import { WalletContext } from '@utils/context';
import { Input, Form, Modal } from 'antd';
import {
    ExclamationCircleOutlined,
    PlusSquareOutlined,
    LockOutlined,
    ImportOutlined
} from '@ant-design/icons';
import StyledOnboarding from '@components/Common/StyledOnBoarding';
import PrimaryButton, {
    SecondaryButton,
    SmartButton,
} from '@components/Common/PrimaryButton';
import { currency } from '@components/Common/Ticker.js';
import { Event } from '@utils/GoogleAnalytics';
import FormPassword from '@components/OnBoarding/formPassword'
const bip39 = require('bip39');

const WelcomeColor = styled.h2`
    color:#FFFFFF;
`

const WarningColor = styled.h3`
    color:#FFFFFF;
`


export const WelcomeText = styled.p`
    color: #FFFFFF;
    width: 100%;
    font-size: 16px;
    margin-bottom: 60px;
    text-align: left;
`;

export const WelcomeLink = styled.a`
    text-decoration: underline;
    color: #6cbe45;
`;

export const OnBoarding = ({ history }) => {
    const ContextValue = React.useContext(WalletContext);
    const { createWallet } = ContextValue;
    const validateMnemonic = bip39.validateMnemonic; // TODO: Mnemonic validation on AVA
    const [formData, setFormData] = useState({
        dirty: true,
        mnemonic: '',
    });

    const [isSeedPhraseModalVisible, setIsSeedPhraseModalVisible] = useState(false);
    const [seedInput, openSeedInput] = useState(false);
    const [isValidMnemonic, setIsValidMnemonic] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleChange = e => {
        const { value, name } = e.target;

        // Validate mnemonic on change
        // Import button should be disabled unless mnemonic is valid
        setIsValidMnemonic(validateMnemonic(value));

        setFormData(p => ({ ...p, [name]: value }));
    };

    function showBackupConfirmModal() {
        const wallet = createWallet(false);
        setFormData(p => ({ ...p, mnemonic: wallet.mnemonic }));
        setIsSeedPhraseModalVisible(true);
    }

    return (
        <>

            <WelcomeColor>Welcome to Guava!</WelcomeColor>
            <WelcomeText>
            Guava is a non-custodial web wallet for AVAX on the X-Chain of Avalalabs.

<p>Guava Wallet is in the beta testing phase. Please limit your use to small amounts of AVAX until this notice is changed.</p>
                <br />
                <br />
            </WelcomeText>

            <PrimaryButton onClick={() => showBackupConfirmModal()}>
                <PlusSquareOutlined /> New Wallet
            </PrimaryButton>

            <SecondaryButton onClick={() => openSeedInput(!seedInput)}>
                <ImportOutlined /> Import Wallet
            </SecondaryButton>
            {seedInput && (
                <StyledOnboarding>
                    <Form style={{ width: 'auto' }}>
                        <Form.Item
                            validateStatus={
                                !formData.dirty && !formData.mnemonic
                                    ? 'error'
                                    : ''
                            }
                            help={
                                !formData.mnemonic || !isValidMnemonic
                                    ? <WarningColor>Valid mnemonic seed phrase required</WarningColor>
                                    : ''
                            }
                        >
                            <Input
                                prefix={<LockOutlined />}
                                placeholder="mnemonic (seed phrase)"
                                name="mnemonic"
                                autoComplete="off"
                                onChange={e => handleChange(e)}
                                required
                            />
                        </Form.Item>
                        <SmartButton disabled={!isValidMnemonic} onClick={() => setIsModalVisible(true)}>
                            Import
                        </SmartButton>
                    </Form>
                </StyledOnboarding>
            )}
       <Modal 
       title="Create a password for your wallet and remember it!" 
       visible={isModalVisible} 
       onCancel={() => setIsModalVisible(false)}
       footer={null}>
            <FormPassword getWallet={() => {
                const wallet = createWallet(formData.mnemonic || false);
                return wallet;
                }}
            confirmPassword={true}
            locked={true}
            textSubmit={formData.mnenomic ? "Ok, import wallet from seed" : "Ok, make me a wallet"}
            afterSubmit={() => {
                setIsModalVisible(false);
                          }}
            />
            </Modal>
             <Modal 
       title="Write down your seed phrase" 
       visible={isSeedPhraseModalVisible} 
       onCancel={() => setIsSeedPhraseModalVisible(false)}
       onOk={() => {
                              setIsModalVisible(true);
                              setIsSeedPhraseModalVisible(false);
                          }}
            >
            <div>
                    {formData.mnemonic}
            </div>
      </Modal>
        </>
    );
};
