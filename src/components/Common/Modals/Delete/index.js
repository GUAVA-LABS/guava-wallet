import React, { useState } from 'react'
import './DeleteModal.css'

export default function DeleteModal(props) {
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
            <div className='delete-card' >
                <h1 className='delete-title'>
                    Are you sure you want to delete your Wallet?
                </h1>
                <span className='delete-warning'>
                    Remember if you don't have your seed phrase you can lose your tokens
                </span>
                <div className='delete-btn' onClick={props.deleteWallet}>
                    Delete
                </div>
                <div className='delete-cancel-btn' onClick={handleClose}>
                    Cancel
                </div>
            </div>
        </div>
    )
}
