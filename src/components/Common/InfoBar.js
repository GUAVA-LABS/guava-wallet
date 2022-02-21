import React, { useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';

const InfoBar = (props) => {
    const barTitle = props.title;
    const content = props.content;
    const link = props.link;
    const isDroppable = props.droppable;
    const [show, showState] = useState({
        display: 'flex',
        position: 'relative',
        margin:'auto',
        textAlign: 'center',
        width: '88%',
        maxHeight: '0px',
        backgroundColor: 'white',
        color: '#011437',
        borderRadius: '0 0 6px 6px',
        boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.16)',
        zIndex:'2',
        transition: 'max-height .5s ease',
        overflow: 'hidden'
    });
    const [iconAnimation, setIconAnimation] = useState({
        fontSize: '16px',
        color: '#DC1199',
        marginLeft: '8px',
        transform: '',
        transition: 'transform .3s ease',
        padding: '10px'
    });
    let dropDown = props.droppable;
    if(isDroppable){
        dropDown = () => {
            if(show.maxHeight === '0px'){
                showState(prevState => ({...prevState,maxHeight: '550px'}))
                setIconAnimation(prevState => ({...prevState, transform: 'rotate(90deg)'}))
            }else{
                showState(prevState => ({...prevState,maxHeight: '0px'}))
                setIconAnimation(prevState => ({...prevState, transform: 'rotate(0deg)'}))
                }
        }
    }
    return (
        !props.delete ?
            <>
                <div style={info_bar_style} onClick={() => isDroppable ? dropDown() : window.open(link, '_blank')}>
                    {show.height === '0px' ? <CaretRightOutlined style={iconAnimation} /> : <CaretRightOutlined style={iconAnimation} />
                    }
                    {barTitle}
                </div>

                <div style={show}>
                    {content}
                </div>
            </>
        :
            <div style={info_bar_style} >
                {show.height === '0px' ? 
                    <CaretRightOutlined style={iconAnimation} /> 
                    : 
                    <CaretRightOutlined style={iconAnimation} />
                }
                Delete Wallet
            </div> 
        
    );

}


const info_bar_style = {
    fontSize:'11pt',
    display: 'flex',
    margin:'auto',
    alignItems: 'center',
    width: '85%',
    textAlign:'left',
    padding:'10px',
    fontWeight:'600',
    color:'#011437',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.16)',
    marginTop:'10px',
    zIndex:'2'

}
export default InfoBar;