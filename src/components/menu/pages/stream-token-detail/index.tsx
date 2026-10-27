import { useContext, useRef, useState, type RefObject } from 'react'
import { MenuEntry, MenuPage, MenuSection } from '..'
import type { StreamTokenData } from '../stream-tokens'
import './style.css'
import { MenuNavigator } from '../..'
import { Button } from '../../../../pixely-ui'
import { useNotify } from '../../../../contexts/notification/context'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'motion/react'
import { SuspendConfirmModal } from './suspend-confirm-modal'
import { BASE_URL } from '../../../../consts'
import { useSession } from '../../../../contexts/session/context'
import { AliasRenamePopup } from './alias-rename-popup'

interface MenuStreamTokenDetailProps {
    data?: StreamTokenData,
    ref?: RefObject<null | HTMLDivElement>
}

export const MenuStreamTokenDetail: React.FC<MenuStreamTokenDetailProps> = ({
    data: tokenData = {
        id: 0,
        alias: '',
        token_hint: '',
        created_at: '',
        last_used_at: null,
        last_ip: null
    },
    ref
}) => {
    const [data, setData] = useState(tokenData)
    const { renewSession } = useSession()
    const notify = useNotify()
    const navigator = useContext(MenuNavigator)
    const menuPageRef = useRef<HTMLDivElement>(null)
    const [isSuspendConfirmationShow, setIsSuspendConfirmationShow] = useState(false)
    const [isAliasRenamePopupShow, setIsAliasRenamePopupShow] = useState<false | { scrollTop: number }>(false)

    const entry = (label: string, data: string) => (
        <MenuEntry key={label} onClick={() => window.navigator.clipboard.writeText(data).then(() => notify?.({ content: '已拷贝到剪贴板', duration: 2000 }))}>
            <div className='menu__stream-token-detail__entry-content'>
                <span className='menu__stream-token-detail__entry-content__label'>{label}</span>
                <span className='menu__stream-token-detail__entry-content__data'>{data}</span>
            </div>
        </MenuEntry>
    )
    const suspend = async () => {
        await renewSession()
        const response = await fetch(`${BASE_URL}/api/user/suspend_stream_token`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'token_id': data.id
            })
        })
        if (!response.ok) {
            notify?.({
                title: '网络请求发生预期外的错误',
                content: `${response.url}: ${response.statusText}`,
                addition: '详细信息可在控制台日志中查看',
                duration: 10000
            })
            throw new Error(response.statusText)
        }
        notify?.({
            content: `推流令牌 "${data.alias}" 已停用`,
            duration: 2000
        })
        navigator.pop()
    }
    const aliasRename = async (newAlias: string) => {
        await renewSession()
        const response = await fetch(`${BASE_URL}/api/user/set_stream_token_alias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'token_id': data.id,
                'alias': newAlias
            })
        })
        if (!response.ok) {
            notify?.({
                title: '网络请求发生预期外的错误',
                content: `${response.url}: ${response.statusText}`,
                addition: '详细信息可在控制台日志中查看',
                duration: 10000
            })
            throw new Error(response.statusText)
        }
        console.log(response)
        setData(data => ({...data, alias: newAlias}))
    }
    return (
        <>
            {createPortal((
                <AnimatePresence propagate>
                    {isSuspendConfirmationShow && (
                        <SuspendConfirmModal
                            data={data}
                            onCancel={() => setIsSuspendConfirmationShow(false)}
                            onConfirm={suspend}
                        />
                    )}
                    {isAliasRenamePopupShow && (
                        <AliasRenamePopup
                            scrollTop={isAliasRenamePopupShow.scrollTop}
                            onApply={aliasRename}
                            onCancel={() => setIsAliasRenamePopupShow(false)}
                        />
                    )}
                </AnimatePresence>
            ), document.getElementById('root')!)}
            <MenuPage
                ref={node => {
                    menuPageRef.current = node
                    if (ref !== undefined) ref.current = node
                }}
                header={data.alias}
                onBack={() => navigator.pop()}
            >
                <hr className='menu-page__hr' />
                <MenuSection>
                    {[
                        entry('别名', data.alias),
                        entry('令牌提示', data.token_hint),
                        entry('创建时间', new Date(data.created_at).toLocaleString()),
                        entry('最近使用时间', data.last_used_at === null ? '<无记录>' : new Date(data.last_used_at).toLocaleString()),
                        entry('最近IP地址', data.last_ip === null ? '<无记录>' : data.last_ip)
                    ]}
                </MenuSection>
                <span className='menu__stream-token-detail__button-group'>
                    <Button style={{ width: '100%' }} color='#222222' text='更改别名' onClick={() => setIsAliasRenamePopupShow({ scrollTop: menuPageRef.current?.scrollTop ?? 0})} />
                    <Button style={{ width: '100%' }} color='#602020' text='停用该令牌...' onClick={() => setIsSuspendConfirmationShow(true)} />
                </span>
            </MenuPage>
        </>
    )
}
