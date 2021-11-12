import React from 'react'
import onboardingImg from '@assets/guava-onboarding.png'
import FormPassword from './formPassword'



const ThirdContent = (props) => {
    return(
        <div className='content-center'>
            <div className='onboarding-item'>
                <img className='ob-img' src={onboardingImg} />
            </div>
            <div className='onboarding-item'>
                <span className='h1-title'>
                    Create your Wallet Password
                </span>
            </div>
            <div className='onboarding-item'>
                <div className='slide-content'>
                <FormPassword getWallet={() => {
                const wallet = props.createWallet(props.formData.mnemonic || false);
                return wallet;
                }}
                confirmPassword={true}
                locked={true}
                textSubmit={props.formData.mnenomic ? "Ok, import wallet from seed" : "Ok, make me a wallet"}
                afterSubmit={() => {
                    props.setIsModalVisible(false);
                            }}
                />
                    {/* <input type='text' placeholder='Password'/>
                    <input type='text' placeholder='Confirm password'/> */}
                </div>
            </div>
            <div className='onboarding-item'>
                <a className='onboarding-btn bg-pink-1 onboarding-buttons' onClick={() => props.setSlide(0)}>
                    {/* <NewWalletIcon color='white' size='18px' />  */}
                    <span className='ml-5'>
                        { props.setUp ? 'Make me a Wallet' : 'Import my Wallet'}
                    </span>
                </a>
            </div>
            <div className='onboarding-item'>
                <a className='onboarding-btn bg-blue-1 onboarding-buttons' onClick={() => props.setSlide(props.slider-1)}>
                    {/* <ImportWalletIcon color='white' size='18px' /> */}
                    <span className='ml-5'>
                        Go Back
                    </span>
                </a>
            </div>
        </div>
    )
}

export default ThirdContent;