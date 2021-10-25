import React, { useEffect, useState } from 'react'
import './Home.css'
import { OnBoarding } from "@components/OnBoarding/OnBoarding";
import { Modal } from "@components/Common/Modal/modal"
import { List } from "@components/Common/List/List"


export default function Home(props) {

    const[open, setOpen] = useState({ open: false, name: ""});

    useEffect(() => {
        
    }, [open])

    function handleOpen(name) {
        setOpen({open: true, name: name})
    };
    
    function handleClose() {
        setOpen({open: false, name: ""})
    };
    
    return (
        <div className='container'>

            {/* {props.thereIsWallet && <h1>HOME</h1>}
            {!props.thereIsWallet && <OnBoarding/>} */}

            
            <List/>

            {/* {!loading && wallet && <WalletInfo />}
            {!loading && !wallet ? <OnBoarding /> : null} */}
        </div>
    )
}
