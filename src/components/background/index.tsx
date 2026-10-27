import './style.css'

import Logo from '../../assets/nebulae-broadcast.svg?react'
import LogoRainbow from '../../assets/nebulae-broadcast--rainbow.svg?react'
import image from '../../assets/test-images/wallpaper7.jpg'

import { loadingStartTimestamp } from '../../main'

export const Background: React.FC = () => {
    let isJune = new Date().getMonth() === 5
    isJune = true
    let isProgressBarShow = Date.now() - loadingStartTimestamp > 1000
    return (
        <div className='background'>
            {/* <img className='background__image' src={image} /> */}
            <Logo className={isJune ? 'background__logo--fade-in' : 'background__logo'} />
            {isJune && (
                <>
                    <LogoRainbow className='background__logo--rainbow' />
                    {/* <div className='background__pride-slogan'>
                        <span>HAPPY</span>
                        <span>PRIDE</span>
                    </div> */}
                </>
            )}
            {isProgressBarShow && (
                <div className='background__fake-progress-bar'/>
            )}
        </div>
    )
}
