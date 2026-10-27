import { useEffect, useRef, useState, type CSSProperties } from "react"

export interface AvatarProps {
    src: string,
    fallback?: string,
    /** Diameter in pixel. */
    size?: number,
    /** Boolean or number. Shows in a circle when set to true, or set a number to define the border radius in pixel. */
    rounded?: boolean | number,
    /** Fetch cache mode used to revalidate the avatar image. Defaults to 'no-cache' (revalidates via ETag/If-None-Match). */
    cache?: RequestCache,
    style?: CSSProperties
}

/** A simple Avatar with stale-while-revalidate loading. */
const Avatar: React.FC<AvatarProps> = ({
    src,
    fallback,
    size = 32,
    rounded = true,
    cache = 'no-cache',
    style
}: AvatarProps) => {
    let borderRadius: string
    if(rounded === false) borderRadius = '0px'
    else if(typeof rounded === 'number') borderRadius = rounded + 'px'
    else borderRadius = size / 2 + 'px'

    const [objectSrc, setObjectSrc] = useState<string | null>(null)
    const currentObjectSrcRef = useRef<string | null>(null)
    const staleObjectSrcRef = useRef<string | null>(null)

    useEffect(() => {
        let cancelled = false
        fetch(src, { cache, credentials: 'include' })
            .then(resp => {
                if (!resp.ok) throw new Error(resp.statusText)
                return resp.blob()
            })
            .then(blob => {
                if (cancelled) return
                const url = URL.createObjectURL(blob)
                staleObjectSrcRef.current = currentObjectSrcRef.current
                currentObjectSrcRef.current = url
                setObjectSrc(url)
            })
            .catch(() => {
                // 保持显示当前 src（缓存旧图），加载失败由 img 的 onError 回退到 fallback
            })
        return () => {
            cancelled = true
        }
    }, [src, cache])

    useEffect(() => () => {
        if (staleObjectSrcRef.current !== null) {
            URL.revokeObjectURL(staleObjectSrcRef.current)
            staleObjectSrcRef.current = null
        }
        if (currentObjectSrcRef.current !== null) {
            URL.revokeObjectURL(currentObjectSrcRef.current)
            currentObjectSrcRef.current = null
        }
    }, [])

    return (
        <img
            style={{
                ...style,
                height: size + 'px',
                width: size + 'px',
                borderRadius,
                objectFit: 'cover',
                display: 'block'
            }}
            src={objectSrc ?? src}
            onLoad={() => {
                if (staleObjectSrcRef.current !== null) {
                    URL.revokeObjectURL(staleObjectSrcRef.current)
                    staleObjectSrcRef.current = null
                }
            }}
            onError={(ev) => { if (fallback) ev.currentTarget.src = fallback }}
        />
    )
}

export default Avatar
