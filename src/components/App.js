import React from 'react';
import 'antd/dist/antd.less';
import '../index.css';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '@assets/styles/theme';
import {
    FolderOpenFilled,
    CaretRightOutlined,
    SettingFilled,
    ShopFilled
} from '@ant-design/icons';
import Wallet from '@components/Wallet/Wallet';
import Send from '@components/Send/Send';
import Configure from '@components/Configure/Configure';
import NotFound from '@components/NotFound';
import './App.css';
import { WalletContext } from '@utils/context';
import WalletLabel from '@components/Common/WalletLabel.js';
import {
    Route,
    Redirect,
    Switch,
    useLocation,
    useHistory,
} from 'react-router-dom';
import GuavaMarketIconSrc from '@assets/market-icon.png';
import GuavaMarketPlaceholderImgSrc from '@assets/avamarket.jpeg';
import GuavaHeaderImg from '@assets/guavaheader.png';

import fbt from 'fbt';

const CustomApp = styled.div`
    text-align: center;
    font-family: 'Gilroy', sans-serif;
    background-color: #fbfbfd;
`;
const Footer = styled.div`
    background-color: #fff;
    border-radius: 20px;
    position: fixed;
    bottom: 0;
    width: 500px;
    @media (max-width: 768px) {
        width: 100%;
    }
    border-top: 1px solid #e2e2e2;
`;

export const NavButton = styled.button`
    :focus,
    :active {
        outline: none;
    }
    cursor: pointer;
    padding: 24px 12px 12px 12px;
    margin: 0 28px;
    @media (max-width: 360px) {
        margin: 0 12px;
    }
    background-color: #fff;
    border: none;
    font-size: 12px;
    font-weight: bold;
    .anticon {
        display: block;
        color: rgb(148, 148, 148);
        font-size: 24px;
        margin-bottom: 6px;
    }
    ${({ active }) =>
        active &&
        `    
        color: #EE796F;
        .anticon {
            color: #EE796F;
        }
  `}
`;

export const WalletBody = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    background: #EE796F;
`;

export const WalletCtn = styled.div`
    position: relative;
    width: 500px;
    background-color: #fff;
    min-height: 100vh;
    padding: 10px 30px 120px 30px;
    background: #fff;
    -webkit-box-shadow: 0px 0px 24px 1px rgba(0, 0, 0, 1);
    -moz-box-shadow: 0px 0px 24px 1px rgba(0, 0, 0, 1);
    box-shadow: 0px 0px 24px 1px rgba(0, 0, 0, 1);
    @media (max-width: 768px) {
        width: 100%;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
`;

export const HeaderCtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px 0 30px;
    margin-bottom: 20px;
    justify-content: space-between;
    border-bottom: 1px solid #e2e2e2;
    a {
        color: #848484;
        :hover {
            color: #ff8d00;
        }
    }
    @media (max-width: 768px) {
        a {
            font-size: 12px;
        }
        padding: 10px 0 20px;
    }
`;

export const EasterEgg = styled.img`
    position: fixed;
    bottom: -195px;
    margin: 0;
    right: 10%;
    transition-property: bottom;
    transition-duration: 1.5s;
    transition-timing-function: ease-out;

    :hover {
        bottom: 0;
    }

    @media screen and (max-width: 1250px) {
        display: none;
    }
`;

export const GuavaHeader = styled.img`
    width: 250px;
    margin: 0 auto;
    @media (max-width: 768px) {
        width: 110px;
    }
`;
export const AbcLogo = styled.img`
    width: 150px;
    @media (max-width: 768px) {
        width: 120px;
    }
`;
export const GuavaMarketIcon = styled.img`
    width: 1em;
    margin: 0 auto;
    display: block;
    height: 1em;
`;

const App = () => {
    const ContextValue = React.useContext(WalletContext);
    const { wallet } = ContextValue;
    const location = useLocation();
    const history = useHistory();
    const selectedKey =
        location && location.pathname ? location.pathname.substr(1) : '';

    return (
        <ThemeProvider theme={theme}>
            <CustomApp>
                <WalletBody>
                    <WalletCtn>
                        <HeaderCtn>
                            <GuavaHeader src={GuavaHeaderImg} alt="Guava Wallet" />
                        </HeaderCtn>
                       
                        <Switch>
                            <Route path="/wallet">
                                <Wallet />
                            </Route>
                          
                            <Route path="/send">
                                <Send />
                            </Route>
                            <Route path="/market">
                                <div>
                                    <img src={GuavaMarketPlaceholderImgSrc} alt="Guava Market" />
                                </div>
                            </Route>
                            <Route path="/configure">
                                <Configure />
                            </Route>
                            <Redirect exact from="/" to="/wallet" />
                            <Route component={NotFound} />
                        </Switch>
                    </WalletCtn>
                    {wallet ? (
                        <Footer>
                            <NavButton
                                active={selectedKey === 'wallet'}
                                onClick={() => history.push('/wallet')}
                            >
                                <FolderOpenFilled />
                                <fbt desc="Wallet menu button">Wallet</fbt>
                            </NavButton>

                            <NavButton
                                active={selectedKey === 'send'}
                                onClick={() => history.push('/send')}
                            >
                                <CaretRightOutlined />
                                <fbt desc="Send menu button">Send</fbt>
                            </NavButton>
                            <NavButton
                                active={selectedKey === 'market'}
                                onClick={() => history.push('/market')}
                            >
                                <ShopFilled />
                                <fbt desc="Market menu button">Market</fbt>
                            </NavButton>
                            <NavButton
                                active={selectedKey === 'configure'}
                                onClick={() => history.push('/configure')}
                            >
                                <SettingFilled />
                                <fbt desc="Settings menu button">Settings</fbt>
                            </NavButton>

                        </Footer>
                    ) : null}
                </WalletBody>
            </CustomApp>
        </ThemeProvider>
    );
};

export default App;
