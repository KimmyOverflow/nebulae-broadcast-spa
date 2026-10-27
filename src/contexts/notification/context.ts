import { createContext, useContext } from "react";

export type NotificationData = {
    title?: string,
    content: string,
    addition?: string,
    action?: {
        text: string,
        onClick: () => void
    }[],
    duration?: number
}

export interface NotificationContextValue {
    notify: (data: NotificationData) => void
}

export const NotificationContext = createContext<NotificationContextValue | null>(null)

export function useNotify() {
    const ctx = useContext(NotificationContext)
    if (ctx === null) {
        throw new Error('在 NotificatonContext 外调用了 useNotify. 请检查组件依赖.')
    }
    return ctx.notify
}
