import './style.css'

import { useContext } from 'react';
import { MenuEntry, MenuPage } from '..';
import { type RefreshTokenData } from '../trusted-browsers';
import { MenuNavigator } from '../..';
import { Button } from '../../../../pixely-ui';
import { useNotify } from '../../../../contexts/notification/context';

export const MenuUserAgentDetail: React.FC<{ data: RefreshTokenData}> = ({ data }) => {
    const navigator = useContext(MenuNavigator)
    const notify = useNotify()
    // TODO: Make this a component
    const entry = (label: string, data: string) => {
        <MenuEntry key={label} onClick={() => window.navigator.clipboard.writeText(data).then(() => notify?.({ content: '已拷贝到剪贴板', duration: 2000 }))}>
            <div className='menu__stream-token-detail__entry-content'>
                <span className='menu__stream-token-detail__entry-content__label'>{label}</span>
                <span className='menu__stream-token-detail__entry-content__data'>{data}</span>
            </div>
        </MenuEntry>
    }
    return (
        <MenuPage
            header='用户代理字符串'
            onBack={() => navigator.pop()}
        >
            <div className='menu__user-agent-detail__ua-string'>
                <span>{data.last_user_agent}</span>
                <Button
                    color='#222222'
                    style={{ width: '100%', margin: '8px 0 2px 0' }}
                    text='拷贝到剪贴板'
                />
            </div>
            <hr className='menu-page__hr' />
            {/* TODO: Present parsed UA data as a table */}
        </MenuPage>
    )
}
