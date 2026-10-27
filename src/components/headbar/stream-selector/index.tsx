import './style.css'

import { useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import StreamList from './stream-list'
import { CircularProgress, RippleWrapper } from '../../../pixely-ui'
import { createPortal } from 'react-dom'
import useOutsideClick from '../../../pixely-ui/hooks/useOutsideClick'
import { useSession } from '../../../contexts/session/context'
import { ErrorBoundary } from 'react-error-boundary'
import { useStreamManager } from '../../../contexts/stream-manager/context'
import StreamListItem from './stream-list/stream-list-item'

export interface StreamSelectorProps {
    onChange: (streamId: string) => void
}

export type StreamData = {
    user_id: number,
    stream_id: string,
    media_server_id: string,
    name?: string,
    color?: string,
    password_protected: boolean,
    viewers?: number[]
}

const StreamSelector: React.FC<StreamSelectorProps> = () => {
    const [expanded, setExpanded] = useState(false)
    const selectorRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const { avaliableStreams, currentlyStreaming, play } = useStreamManager()
    const { session } = useSession()
    useOutsideClick(() => setExpanded(false), [selectorRef, listRef])

    const handleSelect = (streamId: string) => {
        setExpanded(false)
        play(streamId)
    }

    let content = null
    switch (true) {
        case session.status === 'none':
            content = (
                <div className='stream-selector--placeholder'>
                    未登录
                </div>
            )
            break
        case session.status === 'pending':
            content = (
                <div className='stream-selector--placeholder'>
                    <CircularProgress size={16} color='white' />
                    正在获取登录状态
                </div>
            )
            break
        case avaliableStreams === null:
            content = (
                <div className='stream-selector--placeholder'>
                    <CircularProgress size={16} color='white' />
                    正在获取直播流列表
                </div>
            )
            break
        case avaliableStreams?.length === 0:
            content = (
                <div className='stream-selector--placeholder'>
                    无可用直播流
                </div>
            )
            break
        case currentlyStreaming !== null:
            const streamData = avaliableStreams.find((stream => stream.stream_id === currentlyStreaming))
            if (streamData !== undefined) {
                content = (
                    <RippleWrapper ref={selectorRef} className='stream-selector' onClick={() => setExpanded(bool => !bool)}>
                        <StreamListItem selected={false} data={streamData}/>
                    </RippleWrapper>
                )
                break
            }
        default:
            content = (
                <RippleWrapper ref={selectorRef} className='stream-selector' onClick={() => setExpanded(bool => !bool)}>
                    <div className='stream-selector--placeholder'>选择直播流</div>
                </RippleWrapper>
            )
    }

    return (
        <ErrorBoundary fallback={<></>} onError={(err) => console.log(err)}>
            {createPortal((
                <AnimatePresence>
                    {expanded ? <StreamList ref={listRef} streams={avaliableStreams} onSelect={handleSelect} /> : null}
                </AnimatePresence>
            ), document.getElementById('root')!)}
            {content}
        </ErrorBoundary>
    )
}

export default StreamSelector
