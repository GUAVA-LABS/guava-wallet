import React, {useState, useEffect} from 'react'
import Receive from './Receive'
import Send from './Send'
import ConfirmSend from './ConfirmSend'
import './Transactions.css'
import closeIcon from '../../../assets/close-icon.png'

export default function Transactions(props) {

    const [state, setState] = useState({
        open: props.open,
        move: true
    });

    const handleClose = () => {
        setState({...state, open:false, move:false})
        setTimeout(() => {
            props.setOpen({...props.open, open:false, action:''})
        }, 220);
    }

    return (
        <>
            <div className={state.move ? 'trans-container card-up' : 'trans-container card-down'}>
                <a onClick={handleClose}>
                    <img className='cancelIcon' src={closeIcon} />
                </a>
                <div className='trans-card'>
                    {props.action == 'receive' ? <Receive /> : null}
                    {props.action == 'send' ? <Send handleOpen={props.handleOpen} /> : null}
                    {props.action == 'confirm' ? <ConfirmSend /> : null}
                </div>
            </div>
        </>
    )
}