import React, {useState, useEffect} from 'react'
import Receive from './Receive'
import Send from './Send'
import './Transactions.css'
import closeIcon from '../../../assets/close-icon.png'


export default function Transactions(props) {

    const [state, setState] = useState({
        open: props.open,
        move: true
    });

    // const handleShow = () => {
    //     setState({
    //         open: props.open,
    //         move: !state.move
    //     })
    // }
    const handleClose = () => {
        setState({...state, open:false, move:false})
        setTimeout(() => {
            props.setOpen({...props.open, open:false, action:'receive'})
        }, 220);
    }
    // useEffect(() => {
        
    // }, [state, props])


    return (
        <>
            <div className={state.move ? 'trans-container card-up' : 'trans-container card-down'}>
                <a onClick={handleClose}>
                    <img className='cancelIcon' src={closeIcon} />
                </a>
                <div className='trans-card'>
                    {props.action == 'receive' ? <Receive /> : null}
                    {props.action == 'send' ? <Send /> : null}
                </div>
            </div>
        </>
    )
}