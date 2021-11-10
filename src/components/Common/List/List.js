import React from 'react';
import '../../../global.css'
import './List.css'
import historyIcon from '../../../assets/guava-history-icon.png';

export function List(props) {

    return (
        <>
            <div className='transaction-line'>
                <div className='row'>
                    <div className='col-icon'>
                        <img src={historyIcon} className='historyIcon'/>
                    </div>
                    <div className='col-1 text-right'>
                        <span className='primary-info'>{props.data.address}</span>
                        <br/>
                        <span className='secondary-info'>{props.data.date}</span>
                    </div>
                    <div className='col-2 text-right'>
                        <span className='primary-info mr-15'>{props.data.amount}</span>
                        <br/>
                        <span className='secondary-info mr-15'>{props.data.amount}</span>
                    </div>
                </div>
            </div>
        </>
    );
}