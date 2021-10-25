import React from 'react';
import '../../../global.css'
import { List } from "@components/Common/List/List"
import closeIcon from '../../../assets/close-icon.png'
import './modal.css'

export function Modal(props) {

    const handleClose = () => {
        props.close(false);
    }

// PARA USAR EL SWITCH, EL ELEMENTO ITERARDOR ES props.name
    return (
        <div className='card-bg'>
            <div className='card'>
                <div className="cardheader">
                    <b>{props.title}</b>
                    <a onClick={handleClose}>
                        <img className='cancelIcon' src={closeIcon} />
                    </a>
                </div>
                <div className="cardbody">
                    <List/>
                </div>
            </div> 
        </div>
    );
}