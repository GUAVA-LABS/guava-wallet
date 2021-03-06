import React, { useState } from 'react'
import '../../../global.css'
import './OnBoarding.css'

import logoGuava from '@assets/guavaheader.png'

import { WalletContext } from '@utils/context';
import { doExpression } from '@babel/types'
import { doc } from 'prettier'
import FormPassword from './formPassword'
import FirstContent from './FirstContent'
import SecondContent from './SecondContent'
import ThirdContent from './ThirdContent'


const bip39 = require('bip39');


// import { prop } from 'dom7'

export default function OnBoarding() {

    const ContextValue = React.useContext(WalletContext);
    const { createWallet } = ContextValue;
    const validateMnemonic = bip39.validateMnemonic; // TODO: Mnemonic validation on AVA
    const [formData, setFormData] = useState({
        dirty: true,
        mnemonic: '',
    });

    const [isSeedPhraseModalVisible, setIsSeedPhraseModalVisible] = useState(false);
    const [seedInput, openSeedInput] = useState(false);
    const [isValidMnemonic, setIsValidMnemonic] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [slider, setSlide] = useState(0);
    const [setUp, setSetUp] = useState(true);

    const handleChange = e => {
        console.log(e)
        const { value, name } = e.target;
        console.log(name)
        // Validate mnemonic on change
        // Import button should be disabled unless mnemonic is valid
        setIsValidMnemonic(validateMnemonic(value));

        setFormData({
            ...formData.mnemonic, [name]: value 
        })
        // setFormData(p => ({ ...p, [name]: value }));

    };

    function showBackupConfirmModal(setUp) {
        const wallet = createWallet(false);
        setFormData(p => ({ ...p, mnemonic: wallet.mnemonic }));
        setIsSeedPhraseModalVisible(true);
        console.log('CREATING')

        if(slider == 0 || slider == 1){
            setSlide(slider+1);
            console.log(slider)
        }else{
            setSlide(0)
            console.log(slider)
        }
        setSetUp(setUp)
    }

    return (
        <div className='onboarding'>
            <div className='onboarding-container'>
                <div className='onboarding-item'>
                    <img className='logo-guava' src={logoGuava}/>
                </div>
                { slider == 0 ? <FirstContent showBackupConfirmModal={showBackupConfirmModal} slider={slider} setSlide={setSlide} setUp={setUp} setSetUp={setSetUp}/> : null}
                { slider == 1 ? <SecondContent handleChange={handleChange} formData={formData} slider={slider} setSlide={setSlide} setUp={setUp} setSetUp={setSetUp}/> : null}
                { slider == 2 ? <ThirdContent createWallet={createWallet} formData={formData} setIsModalVisible={setIsModalVisible} slider={slider} setSlide={setSlide} setUp={setUp}/> : null}
            </div>
            <div className='footer'>
                <a href='https://www.guavawallet.com' target='_blank'>
                    {'Click here to visit our website >'}
                </a>
            </div>
        </div>
    )


}



// IMPORT WALLET
const ImportWalletIcon = (props) => {
    return <svg id="Layer_1" fill={props.color} width={props.size} height={props.size} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><style></style></defs><g id="Button_Icon" data-name="Button Icon"><g id="Group_200" data-name="Group 200"><path id="Icon_awesome-download" data-name="Icon awesome-download" class="cls-1" d="M341.86,27.88H458.14A34.79,34.79,0,0,1,493,62.58V307h127.5A29,29,0,0,1,641,356.55L419.91,577.78a28.14,28.14,0,0,1-39.68,0L158.86,356.55A29,29,0,0,1,179.33,307H307V62.76a34.79,34.79,0,0,1,34.7-34.88ZM772.12,574.43V737.24a34.79,34.79,0,0,1-34.7,34.88H62.76a34.79,34.79,0,0,1-34.88-34.7v-163a34.79,34.79,0,0,1,34.7-34.88H276l71.22,71.21a74.41,74.41,0,0,0,105.25.29l.29-.29L524,539.55H737.24a34.78,34.78,0,0,1,34.88,34.7ZM591.88,702.35a29.08,29.08,0,1,0-29.08,29.07A29.07,29.07,0,0,0,591.88,702.35Zm93,0a29.08,29.08,0,1,0-29.08,29.07A29.07,29.07,0,0,0,684.91,702.35Z"/></g></g></svg>
}




// NEW WALLET
const NewWalletIcon = (props) => {
    return <svg id="Layer_1" fill={props.color} width={props.size} height={props.size} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><style></style></defs><g id="Button_Icon-2" data-name="Button Icon-2"><g id="Group_200-2" data-name="Group 200-2"><path id="Icon_awesome-plus" data-name="Icon awesome-plus" class="cls-1" d="M719,320.27H479.73V81a53.17,53.17,0,0,0-53.17-53.16H373.44A53.17,53.17,0,0,0,320.27,81V320.27H81a53.17,53.17,0,0,0-53.16,53.17v53.17A53.16,53.16,0,0,0,81,479.77H320.27V719a53.17,53.17,0,0,0,53.17,53.12h53.12A53.17,53.17,0,0,0,479.73,719V479.73H719a53.17,53.17,0,0,0,53.16-53.17V373.44A53.17,53.17,0,0,0,719,320.27Z"/></g></g></svg>
}