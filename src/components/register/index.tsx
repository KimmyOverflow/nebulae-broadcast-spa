import { useCallback, useEffect, useRef, useState, type MouseEventHandler, type SubmitEventHandler } from 'react'
import './style.css'

import silhouette from '../../assets/silhouette.png'
import Logo from '../../assets/nebulae-broadcast.svg?react'

import '@fontsource/noto-sans/400.css'
import '@fontsource/noto-sans/700.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/700.css'
import { Button, CircularProgress, TextField } from '../../pixely-ui'

const Register: React.FC = () => {
    const [silhouetteParallax, setSilhouetteParallax] = useState([0, 0])
    const [mouseEnter, setMouseEnter] = useState(false)
    const silhouetteBoxRef = useRef<HTMLDivElement>(null)
    const silhouetteDOMRectRef = useRef<DOMRect | null>(null)

    const measureSilhouetteRect = useCallback(() => {
        silhouetteDOMRectRef.current = silhouetteBoxRef.current?.getBoundingClientRect() ?? null
    }, [])

    useEffect(() => {
        document.title = '账号注册 | NebulaeBroadcast'
    }, [])

    useEffect(() => {
        let disposed = false
        const measure = () => {
            if (!disposed) measureSilhouetteRect()
        }
        measure()

        const box = silhouetteBoxRef.current
        const resizeObserver = new ResizeObserver(measure)
        resizeObserver.observe(document.documentElement)
        if (box !== null) resizeObserver.observe(box)

        window.addEventListener('resize', measure)
        window.addEventListener('scroll', measure, { capture: true, passive: true })
        window.visualViewport?.addEventListener('resize', measure)
        window.visualViewport?.addEventListener('scroll', measure)
        void document.fonts.ready.then(measure)

        return () => {
            disposed = true
            resizeObserver.disconnect()
            window.removeEventListener('resize', measure)
            window.removeEventListener('scroll', measure, { capture: true })
            window.visualViewport?.removeEventListener('resize', measure)
            window.visualViewport?.removeEventListener('scroll', measure)
        }
    }, [measureSilhouetteRect])

    const handleSilhouetteMouseMove: MouseEventHandler<HTMLDivElement> = (ev) => {
        const rect = silhouetteDOMRectRef.current
        if (rect === null) return
        setMouseEnter(true)
        setSilhouetteParallax([
            Math.round(- (ev.clientX - rect.left - rect.width / 2) * 0.33 * 0.1) * 10,
            Math.round(- (ev.clientY - rect.top - rect.height / 2) * 0.33 * 0.1) * 10
        ])
    }

    const [message, setMessage] = useState<{ text: string | null, nonce: number }>({ text: null, nonce: 0 })

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (ev) => {
        ev.preventDefault()
        const data = new FormData(ev.currentTarget)
        const username = String(data.get('username') ?? '')
        const passcode = String(data.get('passcode') ?? '')
        const confirmPasscode = String(data.get('confirm-passcode') ?? '')
        
        if (passcode !== confirmPasscode) {
            setMessage(msg => ({ text: '两次输入的安全口令不一致', nonce: msg.nonce + 1 }))
            return
        }
        
    }

    const [sideImageLoaded, setSideImageLoaded] = useState(false)

    return (
        <div className='register-panel'>
            <div
                ref={silhouetteBoxRef}
                className='register-panel__side-image'
                onMouseEnter={measureSilhouetteRect}
            >
                <img
                    src={silhouette}
                    style={{
                        scale: mouseEnter ? 1.5 : 1,
                        filter: `brightness(0.5) ${mouseEnter ? 'blur(0px) saturate(.33)' : 'blur(2px) saturate(0)'}`,
                        transform: `translateX(${silhouetteParallax[0]}px) translateY(${silhouetteParallax[1]}px)`
                    }}
                    onMouseMove={handleSilhouetteMouseMove}
                    onMouseLeave={() => {
                        setMouseEnter(false)
                        setSilhouetteParallax([0, 0])}
                    }
                    onLoad={() => setSideImageLoaded(true)}
                />
                <div
                    className='register-panel__side-image-mask'
                    style={{ backgroundColor: sideImageLoaded ? 'transparent' : '#111111' }}
                />
                <Logo />
            </div>
            <form
                onSubmit={handleSubmit}
                className='register-panel__form'
            >
                <a href='/'>
                    <svg width='12' height='12' viewBox='0 0 12 12' fill='currentColor' aria-hidden='true'>
                        <path d='M3 6 9 1v10z' />
                    </svg>
                    返回首页
                </a>
                <div className='register-panel__form__title'>
                    <h2>NebulaeBroadcast</h2>
                    <h1>喜欢您来</h1>
                </div>
                <div className='register-panel__form__fields'>
                    <TextField
                        name='username'
                        rippleColor='rgba(255, 255, 255, .08)'
                        placeholder='用户名'
                        required
                    />
                    <p>用户名是您在该网站唯一的身份标识。<br />该名称不可与他人重复。</p>
                    <TextField
                        name='passcode'
                        rippleColor='rgba(255, 255, 255, .08)'
                        placeholder='安全口令'
                        type='password'
                        required
                    />
                    <TextField
                        name='confirm-passcode'
                        rippleColor='rgba(255, 255, 255, .08)'
                        placeholder='确认安全口令'
                        type='password'
                        required
                    />
                    <p>安全口令用于恢复您账号的访问权限。<br />建议使用与其他网站不同的口令，并妥善保管。</p>
                </div>
                <div className='register-panel__form__submit'>
                    <Button
                        type='submit'
                        text='提交'
                        color='white'
                        ripple={{ rippleColor: 'rgba(0, 0, 0, .5)' }}
                    />
                    { message.text !== null ? <span key={message.nonce}>{message.text}</span> : null }
                </div>
            </form>
            <div className='register-panel__skeleton-mask' />
        </div>
    )
}

export default Register