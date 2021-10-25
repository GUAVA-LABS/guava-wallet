import React from "react";
import Wallet, { LoadingCtn } from "@components/Wallet/Wallet";
import NotFound from "@components/NotFound";
import { WalletContext } from "@utils/context";
import {
    Route,
    Redirect,
    Switch,
    useLocation,
    useHistory,
} from 'react-router-dom';
import ErrorBoundary from '@components/ErrorBoundary';


import Home from '@components/Screens/Home/Home';
import Settings from '@components/Screens/Settings/Settings';
import Games from '@components/Screens/Games/Games';
import NavBar from '@components/Common/NavBar/NavBar';
import Header from '@components/Common/Header/Header';
import Configure from '@components/Configure/Configure'
// import { WalletInfo } from '@components/Wallet/Wallet'


import FormPassword from '@components/OnBoarding/formPassword'
import { OnBoarding } from "./OnBoarding/OnBoarding";


const App = () => {
  const ContextValue = React.useContext(WalletContext);
  const [marketImage, setMarketImage] = React.useState(false);

  const { wallet } = ContextValue;
  const location = useLocation();
  const history = useHistory();
  const selectedKey =
    location && location.pathname ? location.pathname.substr(1) : "";

  const isPrimary = (selectedKey === 'home' || selectedKey === 'settings' || selectedKey === 'games');
  const WalletInitialized = () => {
    return (
      <>
        <Header balanceUSD={wallet.avaxBalance ? '$' + wallet.avaxBalance : '$' + 0} balanceAVAX={wallet.avaxBalance ? wallet.avaxBalance + ' AVAX' : 0 + ' AVAX'}/>
          {wallet ? <NavBar isSelected={selectedKey}/> : <NavBar isSelected={selectedKey}/>}
            <Switch>        
                <Route path="/home">
                  <Home thereIsWallet={wallet.avaxBalance} />
                  {/* <OnBoarding/> */}
                </Route>
                <Route path="/settings">
                  {/* {!wallet && <Redirect exact from="/settings" to="/" />} */}
                    <Settings />

                </Route>
                <Route path="/games">
                  <Games />
                </Route>
                <Redirect exact from="/" to="/home" />
                <Route component={NotFound} />
            </Switch>
              
      </>)
  }
  return (

    <ErrorBoundary>
      {
        wallet.avaxBalance ? <WalletInitialized /> : <OnBoarding/>
      }
    </ErrorBoundary>



    // <ErrorBoundary>
    //   <ThemeProvider theme={theme}>
    //     <CustomApp>
    //     </CustomApp>
    //   </ThemeProvider>
    // </ErrorBoundary>
  );
};



export default App;
