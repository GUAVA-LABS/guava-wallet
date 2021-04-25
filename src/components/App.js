import React from "react";
import "antd/dist/antd.less";
import "../index.css";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "@assets/styles/theme";
import Wallet, { LoadingCtn } from "@components/Wallet/Wallet";
import Send from "@components/Send/Send";
import Configure from "@components/Configure/Configure";
import NotFound from "@components/NotFound";
import "./App.css";
import { LoadingOutlined } from "@ant-design/icons";
import { WalletContext } from "@utils/context";
import {
    Route,
    Redirect,
    Switch,
    useLocation,
    useHistory,
} from 'react-router-dom';
import GuavaMarketPlaceholderImgSrc from '@assets/guavamarket.png';
import GuavaHeaderImg from '@assets/guavaheader.svg';
import GuavaWhiteHeaderImg from '@assets/guavaheader.png';
import MenuItems from '@components/Common/MenuItems';
import ErrorBoundary from '@components/ErrorBoundary';
import dynamicContent from '@utils/dynamicContent';
import News from '@components/News/News';
import FormPassword from '@components/OnBoarding/formPassword'

const CustomApp = styled.div`
    text-align: center;
    font-family: 'Gilroy', sans-serif;
    background-color: #d2007d;
    
`;

export const Footer = styled.div`
  background-color: #fff;
  border-radius: 20px;
  position: fixed;
  bottom: 0;
  width: 440px;
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
  margin: 0 12px;
  @media (max-width: 360px) {
    margin: 0 12px;
  }
  background-color: #fff;
  border: none;
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
        color: #D5008C;
        .anticon {
            color: #D5008C;
        }
  `}
`;

export const WalletBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background: #f2f2f2;
`;

export const WalletCtn = styled.div`
    position: relative;
    width: 500px;
    background-color: ${props => props.primary ? '#d2007d' : '#fff'};
    min-height: 100vh;
    padding: 10px 30px 120px 30px;
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
    
    a {
        color: #848484;
        :hover {
            color: #D5008C;
        }
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
export const GuavaMarket = styled.img`
  max-width: 85%;
  margin: 0 auto;
`;

const App = () => {
  const ContextValue = React.useContext(WalletContext);
  const [marketImage, setMarketImage] = React.useState(false);

  const { wallet } = ContextValue;
  const location = useLocation();
  const history = useHistory();
  const selectedKey =
    location && location.pathname ? location.pathname.substr(1) : "";

  const isPrimary = selectedKey === 'wallet';

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CustomApp>
          <WalletBody>
            <WalletCtn primary={isPrimary}>
              <HeaderCtn>
                <GuavaHeader src={isPrimary ? GuavaHeaderImg : GuavaWhiteHeaderImg } alt="Guava Wallet" />
              </HeaderCtn>

              <Switch>
                <Route path="/wallet">
                  <Wallet />
                </Route>
                <Route path="/send">
                  <FormPassword
                    getWallet={() => wallet}
                    textSubmit="Unlock Wallet"
                  >
                    <Send />
                  </FormPassword>
                </Route>
                <Route path="/configure">
                  {!wallet && <Redirect exact from="/configure" to="/" />}
                  <FormPassword
                    getWallet={() => wallet}
                    textSubmit="Unlock Wallet"
                  >
                    <Configure />
                  </FormPassword>
                </Route>
                <Route path="/news">
                  <News />
                </Route>
                <Redirect exact from="/" to="/wallet" />
                <Route component={NotFound} />
              </Switch>
              {wallet ? (
                <MenuItems
                  selectedKey={selectedKey}
                  currentPage={0}
                  handleClick={history.push}
                />
              ) : null}
            </WalletCtn>
          </WalletBody>
        </CustomApp>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
