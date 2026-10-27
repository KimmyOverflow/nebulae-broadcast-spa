import './style.css'

import { useRef, useState } from 'react'

import logo from '../../assets/nebulae-broadcast.svg'
import logoRainbow from '../../assets/nebulae-broadcast--rainbow.svg'

const Logo: React.FC = () => {
    const [rainbow, setRainbow] = useState(false)
    const handleQuadrupleClick = () => {
        const header = document.getElementsByTagName('header').item(0)
        if (header === null) return
        if (header.classList.contains('header--rainbow')) {
            header.classList.remove('header--rainbow')
            setRainbow(false)
        } else {
            header.classList.add('header--rainbow')
            setRainbow(true)
        }
    }

    const clickCountRef = useRef(0)
    const resetTimerRef = useRef<number | null>(null)

    const handleClick = () => {
        if (resetTimerRef.current !== null) {
            window.clearTimeout(resetTimerRef.current)
        }
        clickCountRef.current += 1
        resetTimerRef.current = window.setTimeout(() => {
            clickCountRef.current = 0
            resetTimerRef.current = null
        }, 500)
        if (clickCountRef.current >= 4) {
            clickCountRef.current = 0
            handleQuadrupleClick()
        }
    }

    return (
        <div className='logo' onClick={handleClick}>
            <div className='logo__image-container'>
                <img src={logo} style={{ opacity: rainbow ? 0 : 1 }} />
                <img src={logoRainbow} style={{ opacity: rainbow ? 1 : 0 }} />
            </div>
            <p>Nebulae Broadcast</p>
        </div>
    )
}

export default Logo
