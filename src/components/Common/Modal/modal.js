import React, {useEffect, useState} from 'react';
import '../../../global.css'
import closeIcon from '../../../assets/close-icon.png'
import './Modal.css'


export default function Modal(props) {
    const [state, setState] = useState({
        open: props.open,
        move: true
      });
  
      const handleClose = () => {
          setState({...state, open:false, move:false})
          setTimeout(() => {
              props.setOpen({...props.open, open:false, action:'receive'})
          }, 120);
      }

    //   const testFunction = () => {
    //       console.log('WORKING BUTTON')
    //   }
    return (
        <>
            <div className={state.move ? 'modal-container card-up' : 'modal-container card-down'}>
                <div className='modal-card' >
                    <h1 className='modal-title'>
                        {props.title}
                    </h1>
                    <span className='modal-warning'>
                        {props.warning}
                    </span>
                    <div className={'modal-content'}>
                        {props.content}
                    </div>
                    {/* <a className='continue-btn' onClick={props.sendConfirmation}> */}
                    <a className='continue-btn' onClick={props.sendConfirmation}>
                        {props.continueBtnTitle} 
                    </a>
                    <a className='cancel-btn' onClick={handleClose}>
                        Cancel
                    </a>
                </div>
            </div>
        </>
    );
}