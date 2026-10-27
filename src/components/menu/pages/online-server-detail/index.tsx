import { useContext } from 'react'
import { MenuEntry, MenuPage, MenuSection } from '..'
import type { MediaServerData } from '../online-servers'
import { MenuNavigator } from '../..'
import { MenuPlaceholderError } from '../../placeholders/error'

export const MenuPageOnlineServerDetail: React.FC<{ data: MediaServerData }> = ({ data }) => {
    const navigator = useContext(MenuNavigator)
    
    const entry = (label: string, value: string) =>
        <MenuEntry key={label}>
            <span style={{ opacity: .67 }}>{label}</span>
            <span style={{ marginLeft: 'auto', marginRight: '12px' }}>{value}</span>
        </MenuEntry>

    let parsed = null
    try {
        parsed = JSON.parse(data.stats) as Record<string, string>
    } catch (e) {}

    let content: React.ReactNode =
        <code
            style={{
                backgroundColor: 'var(--panel)',
                wordWrap: 'break-word',
                margin: '12px',
                padding: '12px'
            }}>
            {data.stats}
        </code>

    if (parsed !== null)
        content = <>
            <hr className='menu-page__hr' />
            <MenuSection>
                {Object.keys(parsed).map(key => entry(key, parsed[key]))}
            </MenuSection>
            <hr className='menu-page__hr' />
        </>


    return (
        <MenuPage header={data.media_server_id} onBack={() => navigator.pop()}>
            {content}
        </MenuPage>
    )
}
