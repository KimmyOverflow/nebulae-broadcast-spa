import './style.css'

import StreamListItem from './stream-list-item'
import type { StreamData } from '..'
import { motion } from 'motion/react'
import { type RefObject } from 'react'

interface StreamListProps {
    ref: RefObject<HTMLDivElement | null>
    streams: StreamData[] | null,
    onSelect: (streamId: string) => void
}

const StreamList: React.FC<StreamListProps> = ({ ref, streams, onSelect }) => {
    return (
        <motion.div
            ref={ref}
            className='stream-list-container'
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: .3, ease: [.05, .7, .1, 1] }}
        >
            <div className='stream-list'>
                {streams?.map(entry => <StreamListItem key={entry.stream_id} data={entry} selected={false} onClick={() => onSelect(entry.stream_id) } />)}
            </div>
        </motion.div>
    )
}

export default StreamList