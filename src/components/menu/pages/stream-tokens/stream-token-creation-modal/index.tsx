import { useState } from 'react'
import { TextField, OutlinedButton, Button } from '../../../../../pixely-ui'
import './style.css'

import { AnimatePresence, motion } from 'motion/react'
import { useSession } from '../../../../../contexts/session/context'
import { BASE_URL } from '../../../../../consts'
import { useNotify } from '../../../../../contexts/notification/context'
import { ModalContainer } from '../../../modal'

interface StreamTokenCreationModalProps {
    onCancel: () => void
    onFinish: () => void
}

export const StreamTokenCreationModal: React.FC<StreamTokenCreationModalProps> = ({
    onCancel,
    onFinish
}) => {
    const notify = useNotify()
    const { renewSession } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [tokenAlias, setTokenAlias] = useState('')
    const [token, setToken] = useState<string | null>(null)
    const handleCreateStreamToken = async () => {
        setIsLoading(true)
        await renewSession()
        const response = await fetch(`${BASE_URL}/api/user/gen_stream_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                alias: tokenAlias
            })
        })
        if (!response.ok) {
            setIsLoading(false)
            notify?.({
                title: '网络请求发生预期外的错误',
                content: `${response.url}: ${response.statusText}`,
                addition: '详细信息可在控制台日志中查看',
                duration: 10000
            })
            throw new Error(response.statusText)
        }
        const json = await response.json() as { stream_token: string }
        setToken(json.stream_token)
    }
    return (
        <ModalContainer dimmed centered>
            <AnimatePresence mode='popLayout' propagate>
                <motion.div
                    key={`${token}`}
                    className='menu__stream-token__modal'
                    initial={{ opacity: 0, scale: .9, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: .9, filter: 'blur(8px)' }}
                    transition={{ duration: .5, ease: [.05, .7, .1, 1] }}
                >
                    <p style={{ textAlign: 'center' }}>创建推流令牌</p>
                    {token === null ? (
                        <div className='menu__stream-token__modal__content'>
                            <TextField rippleColor='rgba(255, 255, 255, .08)' placeholder='令牌别名' onChange={setTokenAlias} />
                            <span style={{ display: 'flex', gap: '12px' }}>
                                <OutlinedButton ripple color='rgba(255, 255, 255, .5)' text='取消' onClick={onCancel} style={{ width: 'calc(50% - 6px)' }}/>
                                {/* TODO: 给pixely-ui的Button添加disabled属性。 */}
                                <span style={{ cursor: isLoading || tokenAlias.length === 0 ? 'not-allowed' : undefined, width: 'calc(50% - 6px)' }}>
                                    <Button
                                        style={{
                                            width: '100%',
                                            opacity: isLoading || tokenAlias.length === 0 ? .5 : 1,
                                            pointerEvents: isLoading || tokenAlias.length === 0 ? 'none' : undefined
                                        }}
                                        color='#222222'
                                        text='创建'
                                        loading={isLoading}
                                        onClick={handleCreateStreamToken}
                                    />
                                </span>
                            </span>
                        </div>
                    ) : (
                        <div className='menu__stream-token__modal__content' key='result'>
                            <span className='menu__stream-token__modal__token-text'>{token}</span>
                            <p style={{ opacity: .67, textAlign: 'center' }}>
                                请安全妥善地保存该令牌。
                                <br />
                                出于安全考虑，您无法从密钥管理界面查看
                                <br />
                                令牌明文。令牌丢失需要重新创建。
                            </p>
                            <Button style={{ width: '100%' }} color='#222222' text='拷贝到剪贴板' onClick={() => {
                                window.navigator.clipboard.writeText(token)
                                    .then(() => notify?.({ content: '令牌已拷贝到剪贴板', duration: 2000 }))
                                    .catch(() => notify?.({ content: '令牌未能拷贝到剪贴板，请手动复制令牌。' }))
                            }}/>
                            <Button style={{ width: '100%' }} color='#222222' text='完成' onClick={onFinish} />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </ModalContainer>
    )
}
