import { useCallback, useEffect, useRef } from "react"

export function useSingleFlight<T>(callback: () => Promise<T>): () => Promise<T> {
    const inflightRef = useRef<Promise<T> | null>(null)
    const callbackRef = useRef(callback)
    useEffect(() => { callbackRef.current = callback })
    return useCallback(() => {
        if (inflightRef.current !== null) return inflightRef.current
        const inflight: Promise<T> = callbackRef.current()
        const clear = () => { inflightRef.current = null }
        inflight.then(clear, clear)
        inflightRef.current = inflight
        return inflight
    }, [])
}
