import React from 'react'
import { WalletContext } from "@utils/context";
import { QRCode } from "@components/Common/QRCode";
import { AutoComplete } from 'antd';
import './Receive.css'


const Receive = () => {
    const ContextValue = React.useContext(WalletContext);
    const { wallet } = ContextValue;
    const { address } = wallet;

    const AddressAndBalance = ({ address, avaxBalance }) => {
        return (
          <>
            <div className='receive-container'>
              {address && (   
                  <QRCode id="borderedQRCode" address={address} />
              )}
              {/* <TokenList tokens={wallet.assets || []} /> */}
            </div>
          </>
        );
      };
    
      return (
        <AddressAndBalance address={address} avaxBalance={wallet.avaxBalance} />
      );
}

export default Receive