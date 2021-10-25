import React from 'react';
import '../../../global.css'
import './List.css'
import historyIcon from '../../../assets/guava-history-icon.png';

export function List(props) {

// PARA USAR EL SWITCH, EL ELEMENTO ITERARDOR ES props.name
    return (
        <>
            <div className='table'>
                <div className='row'>
                    <div className='col-icon'>
                        <img src={historyIcon} className='historyIcon'/>
                    </div>
                    <div className='col-1 text-right'>
                        <span className='primary-info'>09820938</span>
                        <br/>
                        <span className='secondary-info'>Mar 13</span>
                    </div>
                    <div className='col-2 text-right'>
                        <span className='primary-info mr-15'>+100$</span>
                        <br/>
                        <span className='secondary-info mr-15'>+10 AVAX</span>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-icon'>
                        <img src={historyIcon} className='historyIcon'/>
                    </div>
                    <div className='col-1 text-right'>
                        <span className='primary-info'>09820938</span>
                        <br/>
                        <span className='secondary-info'>Mar 13</span>
                    </div>
                    <div className='col-2 text-right'>
                        <span className='primary-info mr-15'>+100$</span>
                        <br/>
                        <span className='secondary-info mr-15'>+10 AVAX</span>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-icon'>
                        <img src={historyIcon} className='historyIcon'/>
                    </div>
                    <div className='col-1 text-right'>
                        <span className='primary-info'>09820938</span>
                        <br/>
                        <span className='secondary-info'>Mar 13</span>
                    </div>
                    <div className='col-2 text-right'>
                        <span className='primary-info mr-15'>+100$</span>
                        <br/>
                        <span className='secondary-info mr-15'>+10 AVAX</span>
                    </div>
                </div>
            </div>
        </>
    );
}