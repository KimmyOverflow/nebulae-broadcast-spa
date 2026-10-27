import { useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Headbar from './components/headbar'
import { Background } from './components/background'
import { Player, type PlayerRef } from './components/player'
import Menu from './components/menu'
import useOutsideClick from './pixely-ui/hooks/useOutsideClick'
import { SessionProvider } from './contexts/session/provider'
import { NotificationProvider } from './contexts/notification/provider'

import '@fontsource/noto-sans/400.css'
import '@fontsource/noto-sans/700.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/700.css'
import { StreamManagerProvider } from './contexts/stream-manager/provider'

function App() {
    const playerRef = useRef<PlayerRef>(null)

    const [isMenuShow, setIsMenuShow] = useState(false)
    const userProfileRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const notificationRef = useRef<HTMLDivElement>(null)
    const loginDialogRef = useRef<HTMLDivElement>(null)

    useOutsideClick(() => setIsMenuShow(false), [
        userProfileRef,
        menuRef,
        notificationRef,
        loginDialogRef
    ])

    return (
        <>
            <NotificationProvider ref={notificationRef}>
                <SessionProvider ref={loginDialogRef}>
                    <StreamManagerProvider playerRef={playerRef}>
                        <AnimatePresence>
                            {
                                isMenuShow
                                && (<Menu
                                    key='menu'
                                    ref={menuRef}
                                />)
                            }
                        </AnimatePresence>
                        <Headbar
                            onSelectedStreamChange={(streamId) => playerRef.current?.play(streamId)}
                            onUserProfileClick={() => setIsMenuShow(bool => !bool)}
                            userProfileRef={userProfileRef}
                        />
                        <Player ref={playerRef} />
                        <Background />
                    </StreamManagerProvider>
                </SessionProvider>
            </NotificationProvider>
        </>
    )
}

export default App
