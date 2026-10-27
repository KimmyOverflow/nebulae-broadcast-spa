import { AnimatePresence, motion } from 'motion/react'
import { MenuEntry, MenuPage, MenuSection } from '..'
import { BASE_URL } from '../../../../consts'
import { useFetch } from '../../../../hooks/useFetch'
import { useContext } from 'react'
import { MenuNavigator } from '../..'
import { MenuPlaceholderLoading } from '../../placeholders/loading'
import { MenuPlaceholderEmpty } from '../../placeholders/empty'
import { MenuPlaceholderError } from '../../placeholders/error'

import IconForward from '../../../../assets/forward.svg?react'

export interface MediaServerData {
    media_server_id: string,
    stats: string,
    streams: string[]
}

export const MenuPageOnlineServers: React.FC = () => {
    const navigator = useContext(MenuNavigator)
    const [data, reload] = useFetch<{ servers: MediaServerData[] }>(
        `${BASE_URL}/api/stat/servers`,
        { requireLogin: true }
    )

    const entry = (entry: MediaServerData) => (
        <MenuEntry onClick={() => navigator.push({ location: 'online_server_detail', data: entry })}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', marginRight: 'auto' }}>
                <span>{entry.media_server_id}</span>
                <span style={{ fontSize: '11px', opacity: .67 }}>{`${entry.streams.length} 个活动直播流`}</span>
            </div>
            <IconForward color='white' style={{ marginRight: '4px' }} />
        </MenuEntry>
    )

    let content = null
    switch (data.status) {
        case 'loading':
            content = <MenuPlaceholderLoading key='loading'/>
            break
        case 'success':
            if (data.inner.servers.length === 0) {
                content = <MenuPlaceholderEmpty key='empty' />
                break
            }
            content = (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .1, ease: 'linear' }}
                    key='content'
                >
                    <hr className='menu-page__hr' />
                    <MenuSection>
                        {data.inner.servers.map(item => entry(item))}
                    </MenuSection>
                </motion.div>
            )
            break
        case 'error':
        default: content = <MenuPlaceholderError onRetry={reload} key='error' />
    }
    return (
        <MenuPage
            header='媒体服务器'
            onBack={() => navigator.pop()}
        >
            <AnimatePresence mode='popLayout'>
                {content}
            </AnimatePresence>
        </MenuPage>
    )
}
