import { useState } from 'react'
import { Button } from '../../../../../pixely-ui'
import type { StreamTokenData } from '../../stream-tokens'
import './style.css'

import { motion } from 'motion/react'
import { ModalContainer } from '../../../modal'

interface SuspendConfirmModalProps {
    data: StreamTokenData
    onConfirm: () => Promise<void>
    onCancel: () => void
}

export const SuspendConfirmModal: React.FC<SuspendConfirmModalProps> = ({
    data,
    onConfirm,
    onCancel
}) => {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <ModalContainer centered dimmed>
            <motion.div
                initial={{ opacity: 0, scale: .9, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: .9, filter: 'blur(8px)' }}
                transition={{ duration: .5, ease: [.05, .7, .1, 1] }}
                className='menu__stream-token-detail__modal'
            >
                <p style={{ textAlign: 'center' }}>停用推流令牌</p>
                <div className='menu__stream-token-detail__modal__token-detail'>
                    <p><span>别名</span><span>{data.alias}</span></p>
                    <p><span>令牌提示</span><span>{data.token_hint}</span></p>
                    <p><span>创建时间</span><span>{new Date(data.created_at).toLocaleString()}</span></p>
                    <p><span>最近使用时间</span><span>{data.last_used_at ?? '<无记录>'}</span></p>
                    <p><span>最近IP地址</span><span>{data.last_ip ?? '<无记录>'}</span></p>
                </div>
                <p style={{ textAlign: 'center', opacity: '.67' }}>令牌停用后不可恢复，<br />且将无法继续用于推流。</p>
                <Button style={{ width: '100%' }} color='#111111' text='取消' onClick={onCancel} />
                <span style={{ cursor: isLoading ? 'not-allowed' : undefined, width: '100%' }}>
                    <Button
                        style={{
                            width: '100%',
                            opacity: isLoading ? .5 : 1,
                            pointerEvents: isLoading ? 'none' : undefined
                        }}
                        color='#602020'
                        text='确认停用'
                        loading={isLoading}
                        onClick={() => {
                            setIsLoading(true)
                            onConfirm().finally(() => setIsLoading(false))
                        }}
                    />
                </span>
            </motion.div>
        </ModalContainer>
    )
}
