import './style.css'

import { Button, RippleWrapper, TextField } from '../../pixely-ui'
import { useRef, useState, type Ref, type SubmitEventHandler } from 'react'
import { motion } from 'motion/react'

export interface LoginDialogProps {
    ref?: Ref<HTMLDivElement>
    onSubmit: (value: {
        username: string,
        totpToken: string,
        rememberMe: boolean
    }) => Promise<string | void>
    onCancel: () => void
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ ref, onSubmit, onCancel }) => {
    const [message, setMessage] = useState<{ text: string | null, nonce: number }>({ text: null, nonce: 0 })
    const [isLoading, setIsLoading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (ev) => {
        ev.preventDefault()
        setIsLoading(true)
        const data = new FormData(formRef.current!)
        onSubmit({
            username: data.get('username') as string,
            totpToken: data.get('totp-token') as string,
            rememberMe: typeof data.get('remember-me') === 'string' ? true : false
        }).then(handleSubmitResponse)
    }
    const handleSubmitResponse = (value: string | void) => {
        setIsLoading(false)
        if (value) setMessage(prev => ({ text: value, nonce: prev.nonce + 1 }))
    }
    return (
        <motion.div
            ref={ref}
            className='login-dialog-container'
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: .3, ease: [.05, .7, .1, 1] }}
            onClick={(ev) => ev.stopPropagation()}
        >
            <div className='login-dialog'>
                <div className='login-dialog__header'>
                    <span>您尚未登录。</span>
                    <a href='/register'>注册账号</a>
                    <a href='/recover'>找回账号</a>
                    <RippleWrapper className='login-dialog__close-button' onClick={onCancel}>
                        <svg viewBox="0 0 8 8" width='8' height='8' xmlns='http://www.w3.org/2000/svg'>
                            <line x1='0' y1='0' x2='8' y2='8' stroke='white'/>
                            <line x1='8' y1='0' x2='0' y2='8' stroke='white'/>
                        </svg>
                    </RippleWrapper>
                </div>
                {message.text ? (
                    <motion.p
                        key={message.nonce}
                        className='login-dialog__message'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: .3 }}
                    >
                        {message.text}
                    </motion.p>
                ) : null}
                <form ref={formRef} onSubmit={handleSubmit}>
                    <TextField
                        name='username'
                        required
                        rippleColor='rgba(255, 255, 255, .08)'
                        placeholder='用户名'
                    />
                    <TextField
                        name='totp-token'
                        required
                        rippleColor='rgba(255, 255, 255, .08)'
                        placeholder='动态令牌'
                    />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input defaultChecked name='remember-me' type='checkbox' style={{ marginLeft: '0px' }}/>
                        <label htmlFor='remember-me' style={{ margin: '0 auto 0 4px' }}>信任该浏览器</label>
                        <span style={ isLoading ? { cursor: 'not-allowed' } : undefined }>
                            <Button
                                loading={isLoading}
                                style={{ width: '80px', pointerEvents: isLoading ? 'none' : undefined }}
                                type='submit'
                                text='登录'
                                color='#222222'
                                ripple={{ rippleColor: 'rgba(255, 255, 255, .16)' }}
                            />
                        </span>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}
