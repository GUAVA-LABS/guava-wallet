import React, { useState, useEffect} from 'react'
import '../../../global.css'
import './Header.css'
import logoPinkBg from '../../../assets/guavaheader.svg'
import { Modal } from "@components/Common/Modal/modal"
import { List } from "@components/Common/List/List"
import sendIcon from '../../../assets/send-icon.png'
import receiveIcon from '../../../assets/receive-icon.png'

export default function Header(props) {

    const[open, setOpen] = useState({ open: false, name: "", title:''});

    useEffect(() => {
        
    }, [open])

    function handleOpen(name, title) {
        setOpen({open: true, name: name, title:title})
    };
    
    function handleClose() {
        setOpen({open: false, name: ""})
    };


    return (
        <>
            <div className='box-complete bg-pink-1 header'>

                    <img className='logo' src={logoPinkBg}/>
                    <div className='info'>
                        <h1 className='balance-usd'>{props.balanceUSD}</h1>
                        <h3 style={{margin:'0px !important'}} className='balance-avax'>
                            {props.balanceAVAX}
                        </h3>
                    </div>
                    <div className='transactions'>
                        <a id='btn-receive' className='transaction-button btn-send'
                            onClick={() => handleOpen('name', 'SEND')}
                            >
                            <img className='transIcon' src={sendIcon} />
                            SEND
                        </a>
                        <div className='vline'></div>
                        <a id='btn-send' className='transaction-button btn-receive'
                            onClick={() => handleOpen('name', 'RECEIVE')}
                            >
                            <img className='transIcon' src={receiveIcon} />
                            RECEIVE
                        </a>
                    </div>
                    {open.open ? <Modal name={open.name} close={handleClose} title={open.title}/> : ""}

            </div>
                    {/* <div className='bg'>
                    </div> */}
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
