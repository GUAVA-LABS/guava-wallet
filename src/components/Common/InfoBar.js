import React, { useState } from 'react'
import { RiArrowDropRightLine } from 'react-icons/ri';
import PassCheck from './PassCheck';


const InfoBar = (props) => {
    const barTitle = props.title;
    const content = props.content;
    const link = props.link;
    const isDroppable = props.droppable;
    const [show, showState] = useState({
        display: '',
        textAlign: 'center',
        width: '96%',
        margin: 'auto',
        maxHeight: '0px',
        backgroundColor: 'white',
        color: '#011437',
        borderRadius: '0 0 6px 6px',
        boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.16)',
        zIndex:'1',
        transition: 'max-height .5s ease',
        overflow: 'hidden'
    });
    const [iconAnimation, setIconAnimation] = useState({
        fontSize: '36px',
        color: '#DC1199',
        marginLeft: '8px',
        transform: '',
        transition: 'transform .3s ease'
    });
    let dropDown = props.droppable;
    if(isDroppable){
        dropDown = () => {
            if(show.maxHeight == '0px'){
                showState(prevState => ({...prevState,maxHeight: '550px'}))
                setIconAnimation(prevState => ({...prevState, transform: 'rotate(90deg)'}))
            }else{
                showState(prevState => ({...prevState,maxHeight: '0px'}))
                setIconAnimation(prevState => ({...prevState, transform: 'rotate(0deg)'}))
                }
        }
    }
    return(
        <>
        <div style={info_bar_style} onClick={() => isDroppable ? dropDown() : window.location.href = link}>
            {show.height == '0px' ? <RiArrowDropRightLine style={iconAnimation} /> : <RiArrowDropRightLine style={iconAnimation} />
            }
            {barTitle}
        </div>
        <div style={show}>
            <PassCheck advice='Write your password to reveal the seed phrase'/>
            {/* {content} */}
        </div>
        </>
    )

}


const info_bar_style = {
    fontSize:'11pt',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor:'red',
    textAlign:'left',
    padding:'4px',
    fontWeight:'600',
    color:'#011437',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.16)',
    marginTop:'10px',
    position: 'relative',
    zIndex:'2'

}
export default InfoBar;