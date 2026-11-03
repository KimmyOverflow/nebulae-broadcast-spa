import './style.css'

import IconPen from '../../../../assets/icons/pen.svg?react'
import IconLogout from '../../../../assets/icons/logout.svg?react'
import IconBroadcast from '../../../../assets/icons/broadcast.svg?react'
import IconGlobe from '../../../../assets/icons/globe.svg?react'
import IconInternetServer from '../../../../assets/icons/internet_server.svg?react'
import IconUsers from '../../../../assets/icons/users.svg?react'
import IconOpenSource from '../../../../assets/icons/open_source.svg?react'

import fallback from '../../../../assets/default-profile-pic.svg'

import { useCallback, useContext, useRef, useState, type ChangeEventHandler, type RefObject } from 'react'
import { Avatar, Button, Decorator, RippleWrapper } from '../../../../pixely-ui'
import { BASE_URL } from '../../../../consts'
import { MenuNavigator } from '../..'
import Logo from '../../../logo'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'motion/react'
import { AvatarCropperPopup } from './avatar-cropper-popup'
import { MenuSection, MenuEntry, MenuPage } from '..'
import { useSession } from '../../../../contexts/session/context'
import { useNotify } from '../../../../contexts/notification/context'
import { Popover } from '../popover'
import { ModalContainer } from '../../modal'
import { useStreamManager } from '../../../../contexts/stream-manager/context'

export const MenuHome: React.FC<{
    ref?: RefObject<null | HTMLDivElement>,
}> = ({ ref }) => {
    const notify = useNotify()
    const { stop } = useStreamManager()
    const { session, renewSession, logout } = useSession()
    const navigator = useContext(MenuNavigator)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const menuPageRef = useRef<HTMLDivElement>(null)

    const [cropperPopupShow, setCropperPopupShow] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)

    const handleAvatarCropperPopupDiscard = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setCropperPopupShow(false)
        setAvatarFile(null)
    }, [])

    const handleAvatarCropperPopupApply = useCallback(async (image: Blob) => {
        const response = await fetch(`${BASE_URL}/api/user/update_profile_pic`, {
            method: 'POST',
            headers: { 'Content-Type': 'image/webp' },
            body: image,
            credentials: 'include'
        })
        if (response.status === 401) {
            setCropperPopupShow(false)
            try {
                await renewSession()
            } catch {
                // 用户取消了登录，不重试上传
            }
            return
        }
        if (!response.ok) {
            const data = await response.json().catch(() => null)
            throw new Error(data?.error ?? `HTTP ${response.status}`)
        }
        setCropperPopupShow(false)
        renewSession().catch(console.error)
    }, [renewSession])
    const handleFileInputChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement> = useCallback((ev) => {
        menuPageRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
        if (ev.target.files && ev.target.files.length > 0) {
            const file = ev.target.files[0]
            setAvatarFile(file)
            setCropperPopupShow(true)
        }
    }, [])
    const [logoutPopupShow, setLogoutPopupShow] = useState<false | { scrollTop: number }>(false)
    
    const avatarCropperPopup = (
        <AvatarCropperPopup
            key='avatar_cropper_popup'
            file={avatarFile}
            onApply={handleAvatarCropperPopupApply}
            onDiscard={handleAvatarCropperPopupDiscard}
        />
    )

    const renderLogoutPopup = (scrollTop: number) => (
        <ModalContainer
            key='logout_popup'
            onClickOutside={() => setLogoutPopupShow(false)}
        >
            {ref => (
                <Popover ref={ref as RefObject<HTMLDivElement>} anchor={{ top: 217 - scrollTop, right: 248 }}>
                    <span style={{ padding: '4px 8px' }}>将登出账号并忘记该浏览器</span>
                    <Button
                        color='#222222'
                        style={{ width: '100%' }}
                        text='确认登出'
                        onClick={() => logout().then(() => {
                            notify?.({ content: '登出成功', duration: 2000 })
                            setLogoutPopupShow(false)
                            stop()
                        })}
                    />
                </Popover>
            )}
        </ModalContainer>
    )

    let content = null
    switch (session.status) {
        case 'renewal_pending':
        case 'active':
            content = <>
                <input
                    type='file'
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept='image/png, image/jpeg, image/webp'
                    onChange={handleFileInputChange}
                />
                <div className='menu-profile'>
                    <Decorator<'div'>
                        as='div'
                        decoration={(
                            <RippleWrapper
                                className='menu-profile__profile-pic-overlay'
                                onClick={() => fileInputRef.current?.click()}
                                rippleColor='rgba(255, 255, 255, .5)'
                            >
                                <IconPen color='white' />
                            </RippleWrapper>
                        )}
                    >
                        <Avatar
                            key={session.lastUpdated}
                            size={48}
                            src={`${BASE_URL}/api/user/profile_pic?user_id=${session.data.user_id}`}
                            fallback={fallback}
                        />
                    </Decorator>
                    <div className='menu-profile__userinfo'>
                        <span className='menu-profile__userinfo__description'>
                            {session.data.role === 'user' ? '以用户身份登录' : '以管理员身份登录'}
                        </span>
                        <span className='menu-profile__userinfo__username'>
                            {session.data.username}
                        </span>
                    </div>
                </div>
                <MenuSection>
                    {/* <MenuEntry>
                        <IconBroadcast color='white' />
                        <span>网页直推</span>
                    </MenuEntry> */}
                    {/*
                        TODO: 添加网页直推功能。用户可自行提供推流密钥，也可以让前端自动申请临时密钥，推流结束后自动停用。
                        TODO: 添加网页录制功能。观看者可以对允许录制的直播流录制视频。
                    */}
                    <MenuEntry onClick={() => navigator.push({ location: 'stream_tokens' })}>
                        <IconBroadcast color='white' />
                        <span>管理推流令牌</span>
                    </MenuEntry>
                    <MenuEntry onClick={() => navigator.push({ location: 'trusted_browsers' })}>
                        <IconGlobe color='white' />
                        <span>管理受信任的浏览器</span>
                    </MenuEntry>
                    <MenuEntry onClick={() => setLogoutPopupShow({ scrollTop: menuPageRef.current?.scrollTop ?? 0})}>
                        <IconLogout color='white' />
                        <span>登出</span>
                    </MenuEntry>
                </MenuSection>
                <hr className='menu-page__hr' />
                <MenuSection>
                    <MenuEntry onClick={() => navigator.push({ location: 'online_servers' })}>
                        <IconInternetServer color='white' />
                        <span>查看在线的媒体服务器</span>
                    </MenuEntry>
                    <MenuEntry>
                        <IconUsers color='white' />
                        <span>查看在线用户</span>
                    </MenuEntry>
                </MenuSection>
                <hr className='menu-page__hr' />
                <MenuSection>
                    <MenuEntry onClick={() => navigator.push({ location: 'license-file' })}>
                        <IconOpenSource color='white' />
                        <span>开放源代码许可声明</span>
                    </MenuEntry>
                </MenuSection>
                <div className='menu-logo-container'>
                    <Logo />
                </div>
            </>
            break
        case 'pending':
        case 'none':
        default:
            content = <>
                <div className='menu-profile'>
                    <Avatar size={48} src={fallback} />
                    <div className='menu-profile__userinfo'>
                        <span className='menu-profile__userinfo__description'>
                            登录以使用完整功能
                        </span>
                        <span className='menu-profile__userinfo__username'>
                            访客
                        </span>
                    </div>
                </div>
                <div className='menu__auth-button-group'>
                    {/* TODO: 用用户名+动态口令取代登录按钮，将注册按钮改为 Anchor。 */}
                    <Button color='#111111' text='登录' onClick={renewSession}/>
                    <Button color='#111111' text='注册' onClick={() => window.location.href = '/register'} />
                </div>
                <MenuSection>
                    <MenuEntry onClick={() => navigator.push({ location: 'license-file' })}>
                        <IconOpenSource color='white' />
                        <span>Open source licenses</span>
                    </MenuEntry>
                </MenuSection>
                <div className='menu-logo-container'>
                    <Logo />
                </div>
            </>
    }

    return (
        <>
            {createPortal((
                <AnimatePresence>
                    {cropperPopupShow && avatarCropperPopup}
                    {logoutPopupShow && renderLogoutPopup(logoutPopupShow.scrollTop)}
                </AnimatePresence>
            ), document.getElementById('root')!)}
            <MenuPage header='菜单' ref={node => {
                menuPageRef.current = node
                if (ref !== undefined) ref.current = node
            }}>
                {content}
            </MenuPage>
        </>
    )
}
