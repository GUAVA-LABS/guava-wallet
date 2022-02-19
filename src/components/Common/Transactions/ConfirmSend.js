import React, { useState } from 'react'
import '../Modals/Delete/DeleteModal.css'
const ConfirmSend = (props) => {

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
        <div className={state.move ? 'delete-container card-up' : 'delete-container card-down'}>
            {/* <div className='delete-card' >
                <h1 className='delete-title'>
                    Confirm transaction with password
                </h1>
                <span className='delete-warning'>
                    Transaction fee: 0.001 AVAX
                </span>

                <a className='delete-btn' onClick={() => sendConfirmation()}>
                    Confirm
                </a>
                <a className='delete-cancel-btn' onClick={handleClose}>
                    Cancel
                </a>
            </div> */}
        </div>
    )
  };

export default ConfirmSend