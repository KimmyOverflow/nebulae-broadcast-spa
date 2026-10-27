import { useSyncExternalStore } from 'react'

// 移动设备页面宽度阈值 480px
const MOBILE_QUERY = '(max-width: 480px)'
const mobileQuery = window.matchMedia(MOBILE_QUERY)

const subscribe = (onChange: () => void) => {
    mobileQuery.addEventListener('change', onChange)
    return () => mobileQuery.removeEventListener('change', onChange)
}

export const isMobileViewport = () => mobileQuery.matches

export const useIsMobileViewport = () => useSyncExternalStore(
    subscribe,
    isMobileViewport
)
