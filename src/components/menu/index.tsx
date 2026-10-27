import './style.css'

import { createContext, useState, type Ref } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MenuHome } from './pages/home'
import { MenuStreamTokens, type StreamTokenData } from './pages/stream-tokens'
import { MenuLicenseFile } from './pages/license-file'
import { useSession } from '../../contexts/session/context'
import { MenuStreamTokenDetail } from './pages/stream-token-detail'
import { MenuTrustedBrowsers, type RefreshTokenData } from './pages/trusted-browsers'
import { MenuTrustedBrowserDetail } from './pages/trusted-browser-detail'
import { MenuUserAgentDetail } from './pages/user-agent-detail'
import { MenuPageOnlineServers, type MediaServerData } from './pages/online-servers'
import { MenuPageOnlineServerDetail } from './pages/online-server-detail'
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport'

interface MenuProps {
    ref?: Ref<HTMLDivElement | null>
}

export type MenuPageNavigation = {
    location: 'home' | 'stream_tokens' | 'license-file' | 'trusted_browsers' | 'online_servers'
} | {
    location: 'stream_token_detail',
    data: StreamTokenData
} | {
    location: 'trusted_browser_detail' | 'user_agent_detail',
    data: RefreshTokenData
} | {
    location: 'online_server_detail',
    data: MediaServerData
}

export const MenuNavigator = createContext<{
    push: (navigation: MenuPageNavigation) => void,
    pop: () => void
}>({
    push: () => {},
    pop: () => {}
})

const Menu: React.FC<MenuProps> = ({ ref }) => {
    const isMobile = useIsMobileViewport()
    const { session } = useSession()
    const [stack, setStack] = useState<MenuPageNavigation[]>([{ location: 'home' }])
    const [direction, setDirection] = useState<1 | -1>(1)
    let page
    const last = stack[stack.length - 1]
    switch (last.location) {
        case 'stream_tokens':
            page = <MenuStreamTokens key='stream_tokens' />
            break
        case 'license-file':
            page = <MenuLicenseFile key='license-file' />
            break
        case 'stream_token_detail':
            page = <MenuStreamTokenDetail key='stream_token_detail' data={last.data} />
            break
        case 'trusted_browsers':
            page = <MenuTrustedBrowsers key='trusted_browsers' />
            break
        case 'trusted_browser_detail':
            page = <MenuTrustedBrowserDetail key='trusted_browser_detail' data={last.data} />
            break
        case 'user_agent_detail':
            page = <MenuUserAgentDetail key='user_agent_detail' data={last.data} />
            break
        case 'online_servers':
            page = <MenuPageOnlineServers key='online_servers' />
            break
        case 'online_server_detail':
            page = <MenuPageOnlineServerDetail key='server_detail' data={last.data} />
            break
        case 'home':
        default:
            page = <MenuHome key='home' />
    }
    return (
        <MenuNavigator.Provider value={{
            push: (location) => {
                setDirection(1)
                setStack(stack => [...stack, location])
            },
            pop: () => {
                setDirection(-1)
                setStack(stack => stack.toSpliced(-1, 1))
            }
        }}>
            <motion.div
                ref={ref}
                className='menu-container'
                initial={{ y: isMobile ? 18 : -18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: isMobile ? 18 : -18, opacity: 0 }}
                transition={{ duration: .3, ease: [.05, .7, .1, 1] }}
            >
                <AnimatePresence
                    initial={false}
                    custom={direction}
                >
                    {page}
                </AnimatePresence>
            </motion.div>
        </MenuNavigator.Provider>
    )
}

export default Menu
