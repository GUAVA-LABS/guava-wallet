import React from 'react';
import '../../../global.css'
import { List } from "@components/Common/List/List"
import closeIcon from '../../../assets/close-icon.png'
import './modal.css'
import Send from '@components/Common/Transactions/Send'
import Receive from '@components/Common/Transactions/Receive'

export function Modal(props) {

    const handleClose = () => {
        props.close(false);
    }
    // return(
    //     <div className='card-container'>
    //         <div className='card'>
    //                 <a onClick={handleClose}>
    //                     <img className='cancelIcon' src={closeIcon} />
    //                 </a>
    //             <div className="cardbody">
    //                 {props.title == 'SEND' ? <Send /> : ''}
    //                 {props.title == 'RECEIVE' ? <Receive />: ''}
    //                 {/* <Receive /> */}
    //             </div>
    //         </div> 
    //     </div>
        
    // )

    return (
        <div className={props.open ? 'card-bg card-up' : 'card-bg card-down'}>
            <div className={props.open ? 'card card-up' : 'card card-down'}>
                <div className="cardheader">
                    {/* <b>{props.title}</b> */}
                    <a onClick={handleClose}>
                        <img className='cancelIcon' src={closeIcon} />
                    </a>
                </div>
                <div className="cardbody">
                    {props.title == 'SEND' ? <Send /> : ''}
                    {props.title == 'RECEIVE' ? <Receive />: ''}
                    {/* <Receive /> */}
                </div>
            </div> 
        </div>
    );
}