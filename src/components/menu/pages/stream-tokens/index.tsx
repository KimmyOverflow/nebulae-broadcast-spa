import './style.css'

import IconForward from '../../../../assets/forward.svg?react'

import { useContext, useState } from 'react'
import { MenuSection, MenuPage } from '..'
import { Button, CircularProgress, RippleWrapper, TextField } from '../../../../pixely-ui'
import { MenuNavigator } from '../..'
import { BASE_URL } from '../../../../consts'
import { useFetch } from '../../../../hooks/useFetch'
import { AnimatePresence } from 'motion/react'
import { motion } from 'motion/react'
import { createPortal } from 'react-dom'
import { StreamTokenCreationModal } from './stream-token-creation-modal'
import IconRefresh from '../../../../assets/icons/refresh.svg?react'

export type StreamTokenData = {
    id: number,
    alias: string,
    token_hint: string,
    created_at: string,
    last_used_at: string | null,
    last_ip: string | null
}

const MotionRippleWrapper = motion.create(RippleWrapper<'div'>)

export const MenuStreamTokens: React.FC = () => {
    const navigator = useContext(MenuNavigator)
    const [data, reload] = useFetch<{ stream_tokens: StreamTokenData[] }>(
        `${BASE_URL}/api/user/stream_tokens`,
        { requireLogin: true }
    )
    const [isModalShow, setIsModalShow] = useState(false)
    const [filter, setFilter] = useState('')

    let content = null

    switch (data.status) {
        case 'loading':
            content = (
                <motion.div
                    key='loading'
                    style={{ margin: 'auto' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .1, ease: 'linear' }}
                >
                    <CircularProgress color='white' size={24} />
                </motion.div>
            )
            break
        case 'success':
            if (data.inner.stream_tokens.length === 0) {
                content = (
                    <motion.span
                        key='success_empty'
                        style={{ margin: 'auto' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: .1, ease: 'linear' }}
                    >
                        无数据
                    </motion.span>
                )
                break
            }
            content = (
                <motion.div
                    className='menu__stream-token__entry-container'
                    key='success'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .1, ease: 'linear' }}
                >
                    <span className='menu__stream-token__search-box'>
                        <TextField rippleColor='rgba(255, 255, 255, .08)' placeholder='筛选...' onChange={value => setFilter(value)}/>
                    </span>
                    <MenuSection>
                        <AnimatePresence initial={false}>
                            {data.inner.stream_tokens.filter(entry => entry.alias.toLocaleLowerCase().includes(filter.toLowerCase())).map(entry => (
                                <MotionRippleWrapper
                                    as='div'
                                    key={entry.id}
                                    onClick={() => navigator.push({ location: 'stream_token_detail', data: entry })}
                                    className='menu-page__entry-section__entry'
                                    initial={{ opacity: 0, scale: .9, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: .9, filter: 'blur(4px)' }}
                                    transition={{ duration: .3, ease: [.05, .7, .1, 1] }}
                                    layout
                                >
                                    <div className='menu__stream-token__entry-content'>
                                        <span>{entry.alias}</span>
                                        <span style={{ opacity: .67, fontSize: '11px' }}>
                                            创建于 {new Date(entry.created_at).toLocaleDateString()}
                                            <span style={{ marginLeft: '8px' }}>{entry.token_hint}</span>
                                        </span>
                                    </div>
                                    <IconForward color='white' style={{ marginRight: '4px' }} />
                                </MotionRippleWrapper>
                            ))}
                        </AnimatePresence>
                    </MenuSection>
                    <hr className='menu-page__hr' />
                </motion.div>
            )
            break
        case 'error':
        default:
            content = (
                <motion.div
                    key='error'
                    style={{ margin: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .1, ease: 'linear' }}
                >
                    <Button variant='outlined' startIcon={<IconRefresh color='white' />} color='white' text='重试' onClick={reload} />
                </motion.div>
            )
            break
    }

    return (
        <>
            {createPortal((
                <AnimatePresence>
                    {isModalShow && (
                        <StreamTokenCreationModal
                            key='stream-token-creation-modal'
                            onCancel={() => setIsModalShow(false)}
                            onFinish={() => {
                                setIsModalShow(false)
                                reload()
                            }}
                        />
                    )}
                </AnimatePresence>
            ), document.getElementById('root')!)}
            <MenuPage
                header='推流令牌'
                onBack={() => navigator.pop()}
            >
                <Button
                    color='#222222'
                    text='创建新的推流令牌...'
                    style={{ width: 'calc(100% - 24px)', margin: '12px'}}
                    onClick={() => setIsModalShow(true)}
                />
                <AnimatePresence mode='popLayout'>{content}</AnimatePresence>
            </MenuPage>
        </>
    )
}
