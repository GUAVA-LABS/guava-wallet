import React from 'react'
import onboardingImg from '@assets/guava-onboarding.png'


const SecondContent = (props) => {
    function CopyToClipboard(containerid) {
        if (window.getSelection) {
            if (window.getSelection().empty) { // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) { // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) { // IE?
            document.selection.empty();
        }
    
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select().createTextRange();
            document.execCommand("copy");
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().addRange(range);
            document.execCommand("copy");
        }
    }




    return(
        <div className='content-center'>
            <div className='onboarding-item'>
                <img className='ob-img' src={onboardingImg} />
            </div>
            <div className='onboarding-item'>
                <span className='h1-title'>
                    {props.setUp ? 'Click to copy your Seed Phrase' : 'Write down your Seed Phrase'}
                </span>
            </div>
            <div className='onboarding-item'>
                {props.setUp ? 
                <div id='seed-phrase' className='seed-phrase-container' onClick={() => CopyToClipboard('seed-phrase')}>
                    <p className='seed-phrase'>
                        {/* witch collapse practice feed shame open despair road again ice least witch collapse practice feed shame open despair road again ice least practice feed */}
                        {props.formData.mnemonic}
                    </p>
                </div>
                    :
                    <div className='slide-content'>
                        <input value={props.formData.mnemonic} name="mnemonic" type='text' placeholder='Seed Phrase' onChange={e => props.handleChange(e)} required />

                    </div>
                }
            </div>
            <div className='onboarding-item'>
                <a className='onboarding-btn bg-pink-1 onboarding-buttons' onClick={() => props.setSlide(props.slider+1)}>
                    {/* <NewWalletIcon color='white' size='18px' />  */}
                    <span className='ml-5'>
                        Next
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

export default SecondContent;