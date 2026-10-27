import './style.css'

import { useState } from 'react'
import Color from 'color'
import Lock from '../../../../../assets/lock.svg?react'
import { Avatar, RippleWrapper } from '../../../../../pixely-ui'
import type { StreamData } from '../..'
import fallback from '../../../../../assets/default-profile-pic.svg'
import { BASE_URL } from '../../../../../consts'

export type StreamListItemData = {
    userId: number,
    username: string,
    /** Hex value like `#ffffff`. */
    streamId: string,
    streamName: string,
    mediaServerId: string,
    color: string,
    isPasswordProtected: boolean
    viewers: { userId: number, username: string }[],
}

interface StreamListItemProps {
    data: StreamData
    selected: boolean,
    onClick?: () => void
}

const StreamListItem: React.FC<StreamListItemProps> = ({
    data: {
        media_server_id,
        stream_id,
        user_id,
        name = stream_id,
        color = '333333',
        password_protected
    },
    selected,
    onClick
}) => {
    const [hover, setHover] = useState(false)
    let parsedColor = Color('#333333')
    try {
        parsedColor = Color(`#${color}`)
    } catch {}
    return (
        <RippleWrapper
            className='stream-list-item-wrapper'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
        >
            <div
                className='stream-list-item'
                style={{ backgroundColor: selected ? parsedColor.hex() : parsedColor.alpha(hover ? .5 : 0).toString() }}
            >
                <div className='stream-list-item__main' data-theme={(selected && parsedColor.isLight()) ? 'dark' : 'light'}>
                    <Avatar size={24} src={`${BASE_URL}/api/user/profile_pic?user_id=${user_id}`} fallback={fallback}/>
                    <p>{name}</p>
                    { password_protected ? <Lock /> : null }
                    <div className='stream-list-item__main__media-server-id'>
                        {media_server_id}
                    </div>
                </div>
                <div className='stream-list-item__viewers-container'>
                    
                </div>
            </div>
        </RippleWrapper>
    )
}

export default StreamListItem
