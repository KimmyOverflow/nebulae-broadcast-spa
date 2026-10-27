import { useCallback, useEffect, useState } from "react"
import { useSession } from "../contexts/session/context"
import { useNotify } from "../contexts/notification/context"

type FetchState<T> = {
    status: 'loading'
} | {
    status: 'error',
    error: string
} | {
    status: 'success',
    inner: T
}

type RetryCallback = () => void

export function useFetch<T>(
    input: RequestInfo,
    init?: RequestInit & {
        requireLogin?: boolean
    }
): [
    FetchState<T>,
    RetryCallback
] {
    const notify = useNotify()
    const { renewSession } = useSession()
    const [data, setData] = useState<FetchState<T>>({ status: 'loading' })
    const callback = useCallback(async () => {
        setData({ status: 'loading' })
        if (init && init.requireLogin === true) {
            await renewSession()
        }
        const response = await fetch(input, init)
        if (!response.ok) {
            notify?.({
                title: '网络请求发生预期外的错误',
                content: `${response.url}: ${response.statusText}`,
                addition: '详细信息可在控制台日志中查看',
                duration: 10000
            })
            setData({
                status: 'error',
                error: response.statusText
            })
            return
        }
        try {
            setData({
                status: 'success',
                inner: await response.json()
            })
        } catch (err) {
            setData({
                status: 'error',
                error: String(err)
            })
        }
    }, [])
    useEffect(() => { callback() }, [])
    return [data, callback]
}
