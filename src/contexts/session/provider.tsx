import { useCallback, useEffect, useRef, useState, type Ref } from 'react'
import { AnimatePresence } from 'motion/react'
import { LoginDialog } from '../../components/login-dialog'
import { type SessionState, type SessionData, type SessionRenewalResult } from './context'
import { SessionContext } from './context'
import { BASE_URL } from '../../consts'
import { useNotify } from '../notification/context'

const querySession = async (): Promise<SessionData | null> => {
    const resp = await fetch(`${BASE_URL}/api/auth/query`, { credentials: 'include' })
    switch (resp.status) {
        case 200:
            return await resp.json() as SessionData
        case 401:
            // 未登录
            return null
        default:
            throw new Error(resp.statusText)
    }
}

const refreshSession = async (): Promise<SessionData | null> => {
    const resp = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
    })
    switch (resp.status) {
        case 200:
            return await resp.json() as SessionData
        case 401:
            return null
        default:
            throw new Error(resp.statusText)
    }
}

type LoginResult = {
    status: 'success',
    sessionData: SessionData
} | {
    status: 'bad_credential',
    text: string
}

const login = async ({ username, totpToken, rememberMe }: {
    username: string,
    totpToken: string,
    rememberMe: boolean
}): Promise<LoginResult> => {
    const resp = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            username,
            totp_token: totpToken,
            remember_me: rememberMe
        })
    })
    switch (resp.status) {
        case 200:
            return {
                status: 'success',
                sessionData: await resp.json() as SessionData
            }
        case 400:
        case 401:
        case 403:
            return {
                status: 'bad_credential',
                text: (await resp.json() as { error: string }).error
            }
        default:
            throw new Error(resp.statusText)
    }
}

const logout = async (): Promise<void> => {
    const resp = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    })
    switch (resp.status) {
        case 200:
            return
        default:
            throw new Error(resp.statusText)
    }
}

export const SessionProvider: React.FC<{
    ref?: Ref<HTMLDivElement>,
    children: React.ReactNode
}> = ({ ref, children }) => {
    const notify = useNotify()
    const inflightRef = useRef<Promise<SessionRenewalResult> | null>(null)
    const inflightResolverRef = useRef<(result: SessionRenewalResult) => void | null>(null)
    const [isLoginDialogShow, setLoginDialogShow] = useState(false)
    const [sessionState, setSessionState] = useState<SessionState>({ status: 'none' })

    const renewSession = useCallback((): Promise<SessionRenewalResult> => {
        if (inflightRef.current !== null) return inflightRef.current
        const inflight: Promise<SessionRenewalResult> = (async () => {
            setSessionState(state => {
                if (state.status === 'active') return {
                    ...state,
                    status: 'renewal_pending'
                }
                return { status: 'pending' }
            })
            try {
                let session = await querySession()
                if (session !== null) {
                    setSessionState({
                        status: 'active',
                        data: session,
                        lastUpdated: Date.now()
                    })
                    return {
                        status: 'renew_success',
                        sessionData: session
                    }
                }

                session = await refreshSession()
                if (session !== null) {
                    setSessionState({
                        status: 'active',
                        data: session,
                        lastUpdated: Date.now()
                    })
                    return {
                        status: 'refresh_success',
                        sessionData: session
                    }
                }

                setSessionState({ status: 'pending' })
                setLoginDialogShow(true)
                return new Promise<SessionRenewalResult>((resolve, _) => {
                    inflightResolverRef.current = resolve
                })
            } catch (err) {
                setSessionState({ status: 'none' })
                notify({ title: '尝试刷新登录会话时出现异常', content: (err as Error).message })
                throw err
            }
        })()
        inflight.finally(() => inflightRef.current = null)
        inflightRef.current = inflight
        return inflight
    }, [])

    const handleLogout = async () => {
        await logout()
        setSessionState({ status: 'none' })
    }

    const handleLoginDialogSubmit = useCallback(async (value: {
        username: string,
        totpToken: string,
        rememberMe: boolean
    }) => {
        let result: LoginResult
        try {
            result = await login(value)
        } catch (err) {
            notify?.({
                title: '尝试登录时发生异常',
                content: (err as Error).message
            })
            return
        }
        if (result.status === 'bad_credential') {
            return result.text
        }
        setSessionState({
            status: 'active',
            data: result.sessionData,
            lastUpdated: Date.now()
        })
        notify?.({ content: `登录成功。欢迎回来，${result.sessionData.username}！` })
        setLoginDialogShow(false)
        inflightResolverRef.current?.({
            status: 'login_success',
            sessionData: result.sessionData
        })
        inflightResolverRef.current = null
    }, [notify])

    const handleLoginDialogCancel = useCallback(() => {
        setSessionState({ status: 'none' })
        setLoginDialogShow(false)
        inflightResolverRef.current?.({ status: 'user_cancelled' })
        inflightResolverRef.current = null
        return null
    }, [])
    
    const refreshTimeoutRef = useRef<number | null>(null)
    const handleDocumentFocus = async () => {
        if (refreshTimeoutRef.current === null || Date.now() - refreshTimeoutRef.current > 30 * 1000) {
            refreshTimeoutRef.current = Date.now()
            await renewSession()
        }
    }

    useEffect(() => {
        document.addEventListener('focus', handleDocumentFocus)
        return () => {
            document.removeEventListener('focus', handleDocumentFocus)
        }
    }, [])

    useEffect(() => {
        renewSession().then(session => {
            if (session.status === 'refresh_success') {
                notify({ content: `自动登录成功。欢迎回来，${session.sessionData.username}！` })
            }
        })
    }, [])

    return (
        <SessionContext.Provider value={{
            session: sessionState,
            renewSession,
            logout: handleLogout
        }}>
            <AnimatePresence>
                {isLoginDialogShow &&
                    <LoginDialog
                        ref={ref}
                        onSubmit={handleLoginDialogSubmit}
                        onCancel={handleLoginDialogCancel}
                    />
                }
            </AnimatePresence>
            {children}
        </SessionContext.Provider>
    )
}
