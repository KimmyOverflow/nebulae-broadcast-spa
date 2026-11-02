import './silhouette.css'

import { useState, useRef, useCallback, useEffect, type MouseEventHandler } from "react"
import Logo from '../../assets/nebulae-broadcast.svg?react'
import silhouette from '../../assets/silhouette.png'

export const Silhouette: React.FC = () => {
    const [silhouetteParallax, setSilhouetteParallax] = useState([0, 0])
    const [mouseEnter, setMouseEnter] = useState(false)
    const silhouetteBoxRef = useRef<HTMLDivElement>(null)
    const silhouetteDOMRectRef = useRef<DOMRect | null>(null)

    const measureSilhouetteRect = useCallback(() => {
        silhouetteDOMRectRef.current = silhouetteBoxRef.current?.getBoundingClientRect() ?? null
    }, [])

    useEffect(() => {
        let disposed = false
        const measure = () => {
            if (!disposed) measureSilhouetteRect()
        }
        measure()

        const box = silhouetteBoxRef.current
        const resizeObserver = new ResizeObserver(measure)
        resizeObserver.observe(document.documentElement)
        if (box !== null) resizeObserver.observe(box)

        window.addEventListener('resize', measure)
        window.addEventListener('scroll', measure, { capture: true, passive: true })
        window.visualViewport?.addEventListener('resize', measure)
        window.visualViewport?.addEventListener('scroll', measure)
        void document.fonts.ready.then(measure)

        return () => {
            disposed = true
            resizeObserver.disconnect()
            window.removeEventListener('resize', measure)
            window.removeEventListener('scroll', measure, { capture: true })
            window.visualViewport?.removeEventListener('resize', measure)
            window.visualViewport?.removeEventListener('scroll', measure)
        }
    }, [measureSilhouetteRect])

    const handleSilhouetteMouseMove: MouseEventHandler<HTMLDivElement> = (ev) => {
        const rect = silhouetteDOMRectRef.current
        if (rect === null) return
        setMouseEnter(true)
        setSilhouetteParallax([
            Math.round(- (ev.clientX - rect.left - rect.width / 2) * 0.33 * 0.1) * 10,
            Math.round(- (ev.clientY - rect.top - rect.height / 2) * 0.33 * 0.1) * 10
        ])
    }

    const [sideImageLoaded, setSideImageLoaded] = useState(false)

    return (
        <div
            ref={silhouetteBoxRef}
            className='silhouette'
            onMouseEnter={measureSilhouetteRect}
        >
            <img
                src={silhouette}
                style={{
                    scale: mouseEnter ? 1.5 : 1,
                    filter: `brightness(0.5) ${mouseEnter ? 'blur(0px) saturate(.33)' : 'blur(2px) saturate(0)'}`,
                    transform: `translateX(${silhouetteParallax[0]}px) translateY(${silhouetteParallax[1]}px)`
                }}
                onMouseMove={handleSilhouetteMouseMove}
                onMouseLeave={() => {
                    setMouseEnter(false)
                    setSilhouetteParallax([0, 0])}
                }
                onLoad={() => setSideImageLoaded(true)}
            />
            <div
                className='silhouette-mask'
                style={{ backgroundColor: sideImageLoaded ? 'transparent' : '#111111' }}
            />
            <Logo />
        </div>
    )
}