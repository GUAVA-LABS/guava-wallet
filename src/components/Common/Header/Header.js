import React, { useState, useEffect} from 'react'
import '../../../global.css'
import './Header.css'
import logoPinkBg from '../../../assets/guavaheader.svg'
// import { Modal } from "@components/Common/Modal/modal"
import { List } from "@components/Common/List/List"
import sendIcon from '../../../assets/send-icon.png'
import receiveIcon from '../../../assets/receive-icon.png'
import Transactions from '@components/Common/Transactions/Transactions'
import { currency } from '@components/Common/Ticker'

export default function Header(props) {

    const[open, setOpen] = useState({
        open: false,
        action: ''
    });

    useEffect(() => {
    }, [open])

    function handleOpen(action) {
        // if(action == '')
        setOpen({open:!open.open, action: action})
        // getAvaxPrice()
        // setOpen(!open)
        // setAction(action)
        // setOpen((prev) => {
        //     return({...prev, open:!prev.open, action: action})
        // })
    };
    
    async function getAvaxPrice(){
        const url = 'https://avascan.info/api/v2/price'
        const response = await fetch(url, {
            mode: 'no-cors',
            headers: {
                "Access-Control-Allow-Origin" : "*", 
                "Access-Control-Allow-Credentials" : true 
            }
        });
        const data = await response.json()
        console.log(data)
    }

    return (
        <>
            <div className='box-complete bg-pink-1 header'>

                    <img className='logo' src={logoPinkBg}/>
                    <div className='info'>
                        <h1 className='balance-usd'>
                            {props.balanceUSD}
                            {
                                
                            }
                        </h1>
                        <h3 style={{margin:'0px !important'}} className='balance-avax'>
                            {props.balanceAVAX}
                        </h3>
                    </div>
                    <div className='transactions'>
                        <a id='btn-receive' className='transaction-button btn-send'
                            onClick={() => handleOpen('send')}
                            >
                            <img className='transIcon' src={sendIcon} />
                            SEND
                        </a>
                        <div className='vline'></div>
                        <a id='btn-send' className='transaction-button btn-receive'
                            onClick={() => handleOpen('receive')}
                            >
                            <img className='transIcon' src={receiveIcon} />
                            RECEIVE
                        </a>
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
