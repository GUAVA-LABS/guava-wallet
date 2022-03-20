import React, { useState, useEffect, useCallback} from 'react';
import logoPinkBg from '../../../assets/guavaheader.svg';
import sendIcon from '../../../assets/send-icon.png';
import receiveIcon from '../../../assets/receive-icon.png';
import Transactions from '@components/Common/Transactions/Transactions';

import axios from 'axios';

import '../../../global.css';
import './Header.css';

export const Header = (props)  => {

    const [balanceUSD, setBalanceUSD] = useState();

    const AvaxConverter = axios.create({
        baseURL: 'https://api.coingecko.com/api/'
    })

    const[open, setOpen] = useState({
        open: false,
        action: ''
    });

    const handleOpen = useCallback((action) => {
        setOpen({open:!open.open, action: action})
    }, [open.open]);
    
    const getAvaxPrice = useCallback(async() => {

        await AvaxConverter.get('v3/simple/price?ids=avalanche-2&vs_currencies=usd', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
	    }).then((response) => {
            const data =  Object.values(response.data);
            setBalanceUSD(Number(data[0].usd) * Number(props.avaxBalance))
	    }).catch((e) => {
		    console.log(e, 'error');
	    });

    }, [AvaxConverter, props.avaxBalance]);

    useEffect(() => {
        getAvaxPrice(); 
    }, [getAvaxPrice])

    return (
        <>
            <div className='box-complete bg-pink-1 header'>

                    <div className='right_content'>
                        <img className='logo' alt='logo' src={logoPinkBg}/>
                        <span className='version'>
                        Version 2.0
                        </span>
                    </div>
                    <div className='info'>
                        <h1 className='balance-usd'>
                            {`${balanceUSD} USD`}
                        </h1>
                        <h3 style={{margin:'0px !important'}} className='balance-avax'>
                            {props.balanceAVAX}
                        </h3>
                    </div>
                    <div className='transactions'>
                        <div id='btn-receive' className='transaction-button btn-send'
                            onClick={() => handleOpen('send')}
                            >
                            <img className='transIcon' alt='Send Avax' src={sendIcon} />
                            SEND
                        </div>
                        <div className='vline'></div>
                        <div id='btn-send' className='transaction-button btn-receive'
                            onClick={() => handleOpen('receive')}
                            >
                            <img className='transIcon' alt='Receive Avax' src={receiveIcon} />
                            RECEIVE
                        </div>
                    </div>
                    {
                        open.open ? <Transactions open={open.open} action={open.action} setOpen={setOpen} handleOpen={handleOpen}/> : null
                    }
            </div>
        </>

    )
}


// const transButton = (props) => {

//     return(
//         props.left ? 
//         <div>

//         </div>
//     )

// }
