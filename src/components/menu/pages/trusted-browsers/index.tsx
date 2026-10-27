import { useContext } from 'react'
import { MenuEntry, MenuPage, MenuSection } from '..'
import { MenuNavigator } from '../..'
import { useFetch } from '../../../../hooks/useFetch'
import { BASE_URL } from '../../../../consts'
import { AnimatePresence, motion } from 'motion/react'
import { UAParser } from 'ua-parser-js'

import IconForward from '../../../../assets/forward.svg?react'
import { formatRelativeTime } from '../../../../utilities/format-relative-time'
import { MenuPlaceholderEmpty } from '../../placeholders/empty'
import { MenuPlaceholderLoading } from '../../placeholders/loading'
import { MenuPlaceholderError } from '../../placeholders/error'

export function parseBrowserStringFromUA(ua: string | null) {
    if (ua === null) return '<空白的用户代理>'
    const result = UAParser(ua)

    let string = '<未知的用户代理>'
    if (result.browser.name) string = result.browser.name
    if (result.browser.version) string += ` ${result.browser.version}`
    return string
}

export type RefreshTokenData = {
    id: number
    alias: string | null
    created_at: string
    last_updated_at: string
    last_user_agent: string | null
    last_ip: string | null
    active_sessions: number,
    is_used_by_current_session: boolean
}

export const MenuTrustedBrowsers: React.FC = () => {
    const navigator = useContext(MenuNavigator)
    const [data, reload] = useFetch<{ refresh_tokens: RefreshTokenData[] }>(
        `${BASE_URL}/api/user/refresh_tokens`,
        { requireLogin: true }
    )
    let content = null
    switch (data.status) {
        case 'loading':
            content = <MenuPlaceholderLoading />
            break
        case 'success':
            if (data.inner.refresh_tokens.length === 0) {
                content = <MenuPlaceholderEmpty />
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
                    <hr className='menu-page__hr' />
                    <MenuSection>
                        <AnimatePresence initial={false}>
                            {data.inner.refresh_tokens.map(entry => (
                                <MenuEntry key={entry.id} onClick={() => navigator.push({ location: 'trusted_browser_detail', data: entry })}>
                                    <span style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', marginRight: 'auto' }}>
                                        <span>
                                            {entry.is_used_by_current_session && <span style={{ marginRight: '4px', fontWeight: '700' }}>当前</span>}
                                            {entry.alias ?? parseBrowserStringFromUA(entry.last_user_agent)}
                                        </span>
                                        <span style={{ fontSize: '11px', opacity: .67 }}>
                                            <span style={{ marginRight: '4px' }}>记录于 {new Date(entry.created_at).toLocaleDateString()}</span>
                                            {entry.active_sessions > 0 ? `${entry.active_sessions}个活跃会话` : `最近使用于 ${formatRelativeTime(Date.parse(entry.last_updated_at))}`}
                                        </span>
                                    </span>
                                    <IconForward color='white' style={{ marginLeft: '-8px', marginRight: '4px' }} />
                                </MenuEntry>
                            ))}
                        </AnimatePresence>
                    </MenuSection>
                </motion.div>
            )
            break
        case 'error':
        default:
            content = <MenuPlaceholderError onRetry={reload} />
            break
    }
    return (
        <MenuPage header='受信任的浏览器' onBack={() => navigator.pop()}>
            <AnimatePresence mode='popLayout'>{content}</AnimatePresence>
        </MenuPage>
    )
}
