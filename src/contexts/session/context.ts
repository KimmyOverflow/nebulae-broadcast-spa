import { createContext, useContext } from 'react'

export type AuthedFetchData<T> = T | 'not_logged_in' | 'loading'

export type SessionRenewalResult = {
    status: 'user_cancelled'
} | {
    status: 'renew_success' | 'refresh_success' | 'login_success',
    sessionData: SessionData
}

export type SessionData = {
    user_id: number,
    username: string,
    role: 'user' | 'admin',
    created_at: string
}

export type SessionState = {
    status: 'pending' | 'none'
} | {
    status: 'renewal_pending' | 'active',
    data: SessionData
    lastUpdated: number
}

export interface SessionContextValue {
    session: SessionState
    renewSession: () => Promise<SessionRenewalResult>
    logout: () => Promise<void>
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession(): SessionContextValue {
    const ctx = useContext(SessionContext)
    if (ctx === null) throw new Error('在 SessionContext 外调用了 useSession. 请检查组件依赖.')
    return ctx
}
