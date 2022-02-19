import React, { useState } from 'react';
import '../../../../global.css'
import './modal.css'

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
                    <div className='continue-btn' onClick={props.sendConfirmation}>
                        {props.continueBtnTitle} 
                    </div>
                    <div className='cancel-btn' onClick={handleClose}>
                        Cancel
                    </div>
                </div>
            </div>
        </>
    );
}