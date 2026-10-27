import './style.css'

import Logo from "../logo"
import StreamSelector from './stream-selector'
import UserProfile from './user-profile'
import type { Ref } from 'react'

export interface HeadbarProps {
    onSelectedStreamChange: (streamId: string) => void
    onUserProfileClick: () => void
    userProfileRef?: Ref<HTMLDivElement | null>
}

const Headbar: React.FC<HeadbarProps> = ({
    onSelectedStreamChange,
    onUserProfileClick,
    userProfileRef
}) => {
    return (
        <header>
            <div style={{ flexGrow: '1', display: 'flex', alignItems: 'center', height: '36px' }}>
                <Logo />
                <UserProfile
                    onClick={onUserProfileClick}
                    ref={userProfileRef}
                />
            </div>
            <div className='stream-selector-container'>
                <StreamSelector onChange={onSelectedStreamChange} />
            </div>
        </header>
    )
}

export default Headbar
