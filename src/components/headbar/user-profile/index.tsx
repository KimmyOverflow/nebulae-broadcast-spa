import type { Ref } from 'react'
import { Avatar, CircularProgress, RippleWrapper } from '../../../pixely-ui'
import './style.css'

import fallback from '../../../assets/default-profile-pic.svg'
import { BASE_URL } from '../../../consts'
import { useSession } from '../../../contexts/session/context'

interface UserProfileProps {
    onClick: () => void
    ref?: Ref<HTMLDivElement | null>
}

const UserProfile: React.FC<UserProfileProps> = ({ onClick, ref }) => {
    const { session } = useSession()

    switch (session.status) {
        case 'pending': return (
            <div className='user-profile--placeholder'>
                <p className='user-profile__text'>请稍后</p>
                <span style={{ padding: '4px' }}>
                    <CircularProgress size={16} color='white' />
                </span>
            </div>
        )
        case 'renewal_pending':
        case 'active': return (
            <RippleWrapper
                ref={ref}
                onClick={onClick}
                className='user-profile'
            >
                <p className='user-profile__text'>{session.data.username}</p>
                <Avatar
                    key={session.lastUpdated}
                    size={24}
                    src={`${BASE_URL}/api/user/profile_pic?user_id=${session.data.user_id}`}
                    fallback={fallback}
                    style={{
                        outline: '1px solid red',
                        outlineOffset: '2px'
                    }}
                />
            </RippleWrapper>
        )
        default: return (
            <RippleWrapper
                ref={ref}
                onClick={onClick}
                className='user-profile'
            >
                <p className='user-profile__text'>访客</p>
                <Avatar size={24} src={fallback} />
            </RippleWrapper>
        )
    }
}

export default UserProfile
