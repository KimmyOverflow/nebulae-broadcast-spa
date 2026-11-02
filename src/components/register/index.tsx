import { useEffect, useState, type SubmitEventHandler } from 'react'
import './style.css'

import '@fontsource/noto-sans/400.css'
import '@fontsource/noto-sans/700.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/700.css'
import { Button, TextField } from '../../pixely-ui'
import { Silhouette } from './silhouette'

const Register: React.FC = () => {
    useEffect(() => {
        document.title = '账号注册 | NebulaeBroadcast'
    }, [])

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

    return (
        <div className='register-panel'>
            <div className='register-panel__side-image'>
                <Silhouette />
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