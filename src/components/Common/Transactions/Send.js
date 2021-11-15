import React from 'react'
import './Send.css'


const Send = () => {

    return (
        <div className='send'>
            {/* <div>
                <input type='text' placeholder='AVAX Address'/>
                <a>QR</a>
            </div> */}
            <input className='send-input' type='text' placeholder='AVAX Address'/>
            <input className='send-input' type='text' placeholder='Amount' />
            <input className='send-btn' type='Button' value='Send' />
        </div>
    )
}

export default Send