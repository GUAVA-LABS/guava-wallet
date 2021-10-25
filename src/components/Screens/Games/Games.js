import React from 'react'
import flipCardIcon from '../../../assets/guava-history-icon.png'
import './Games.css'

export default function Games() {
    return (
        <>
            <div className='container'>
                <div className='table'>
                    <div className='row'>
                        <div className='col-icon'>
                            <img src={flipCardIcon} className='flipCardIcon'/>
                        </div>
                        <div className='col-1 text-right'>
                            <span className='primary-info'>Flip Card Game</span>
                            <br/>
                        </div>
                        <div className='col-2 text-right'>
                            <button className='games-btn mr-15'>
                                <b>Play</b>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
