import { useContext, useState } from 'react'
import { MenuEntry, MenuPage, MenuSection } from '..'
import { parseBrowserStringFromUA, type RefreshTokenData } from '../trusted-browsers'
import { MenuNavigator } from '../..'
import { useNotify } from '../../../../contexts/notification/context'
import IconForward from '../../../../assets/forward.svg?react'
import { Button } from '../../../../pixely-ui'

export const MenuTrustedBrowserDetail: React.FC<{ data: RefreshTokenData}> = ({
    data: tokenData = {
        id: 0,
        alias: '',
        created_at: '',
        last_updated_at: '',
        last_user_agent: null,
        last_ip: null,
        active_sessions: 0,
        is_used_by_current_session: false
    }
}) => {
    const navigator = useContext(MenuNavigator)
    const notify = useNotify()
    const [data, setData] = useState(tokenData)
    const entry = (label: string, data: string) => (
        <MenuEntry key={label} onClick={() => window.navigator.clipboard.writeText(data).then(() => notify?.({ content: '已拷贝到剪贴板', duration: 2000 }))}>
            <div className='menu__stream-token-detail__entry-content'>
                <span className='menu__stream-token-detail__entry-content__label'>{label}</span>
                <span className='menu__stream-token-detail__entry-content__data'>{data}</span>
            </div>
        </MenuEntry>
    )
    return (
        <MenuPage
            header={data.alias ?? parseBrowserStringFromUA(data.last_user_agent)}
            onBack={() => navigator.pop()}
        >
            <hr className='menu-page__hr' />
            <MenuSection>
                {[
                    entry('别名', data.alias === null ? '<未设置>' : data.alias),
                    entry('创建时间', new Date(data.created_at).toLocaleString()),
                    entry('最近使用时间', new Date(data.last_updated_at).toLocaleString()),
                    entry('最近IP地址', data.last_ip === null ? '无记录' : data.last_ip)
                ]}
            </MenuSection>
            <hr className='menu-page__hr' />
            <MenuSection>
                <MenuEntry key='ua' onClick={() => navigator.push({ location: 'user_agent_detail', data: data })}>
                    <span>查看用户代理字符串</span>
                    <IconForward color='white' style={{ marginLeft: 'auto', marginRight: '4px' }}/>
                </MenuEntry>
            </MenuSection>
            <div style={{ display: 'flex', flexDirection: 'column', margin: '12px', gap: '12px' }}>
                <Button style={{ width: '100%' }} color='#222222' text='更改别名' />
                <Button style={{ width: '100%' }} color='#602020' text='忘记该浏览器...' />
            </div>
        </MenuPage>
    )
}
