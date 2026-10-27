import { useEffect, useRef } from 'react'

function useOutsideClick(
    callback: (ev: PointerEvent) => void,
    refs: React.RefObject<HTMLElement | null>[],
) {
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    const refsRef = useRef(refs)
    refsRef.current = refs

    const mouseDownRef = useRef<EventTarget>(null)
    const ignoreClickRef = useRef(false)

    useEffect(() => {
        const handleClick = (ev: PointerEvent) => {
            if (ignoreClickRef.current) {
                ignoreClickRef.current = false
                return
            }
            for (const ref of refsRef.current) {
                if (
                    ref.current &&
                    mouseDownRef.current &&
                    ref.current.contains(mouseDownRef.current as Node)
                ) return
            }
            callbackRef.current(ev)
        }
        const handleMouseDown = (ev: MouseEvent) => {
            mouseDownRef.current = ev.target
        }
        document.addEventListener('click', handleClick)
        document.addEventListener('mousedown', handleMouseDown)
        return () => {
            document.removeEventListener('click', handleClick)
            document.removeEventListener('mousedown', handleMouseDown)
        };
    }, []);
}

export default useOutsideClick