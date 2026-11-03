import { useCallback, useEffect, useRef } from "react"

export function useSingleFlight<T, A extends unknown[] = []>(
    callback: (...args: A) => Promise<T>
): (...args: A) => Promise<T> {
    const inflightRef = useRef<Promise<T> | null>(null)
    const callbackRef = useRef(callback)
    useEffect(() => { callbackRef.current = callback })
    return useCallback((...args: A) => {
        if (inflightRef.current !== null) return inflightRef.current
        const inflight: Promise<T> = callbackRef.current(...args)
        const clear = () => { inflightRef.current = null }
        inflight.then(clear, clear)
        inflightRef.current = inflight
        return inflight
    }, [])
}
