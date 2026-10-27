import './style.css'

import Logo from '../../assets/nebulae-broadcast.svg?react'
import LogoRainbow from '../../assets/nebulae-broadcast--rainbow.svg?react'
import { useEffect, useState } from 'react'

export const Splash: React.FC = () => {
    let isJune = new Date().getMonth() === 5
    isJune = true
    const [showProgress, setShowProgress] = useState(false)
    useEffect(() => {
        const id = setTimeout(() => setShowProgress(true), 1000)
        return () => clearTimeout(id)
    })
    return (
        <div id='splash'>
            {isJune ? (
                <>
                    <LogoRainbow className='splash__logo' />
                    {/* <div className='splash__pride-slogan'>
                        <span>HAPPY</span>
                        <span>PRIDE</span>
                    </div> */}
                </>
            ) : (
                <Logo className='splash__logo' />
            )}
            {showProgress && <div className='splash__fake-progress-bar'><span /></div>}
        </div>
    )
}
