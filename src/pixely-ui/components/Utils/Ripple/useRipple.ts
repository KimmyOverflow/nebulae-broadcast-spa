import { createRef, type PointerEventHandler, useState } from "react"
import { type RippleData } from "./RipplePool";

/** 
 * Hook to create and manage ripple effects for UI elements.
 * Maintains an array of ripple positions and refs internally.
 * Used in conjunction with RipplePool component for rendering.
 * 
 * @param ripplePoolRef - Reference to the div element that contains the ripples (ref of RipplePool)
 * @param rippleProps - Optional configuration for ripple appearance and behavior
 * @returns Object containing ripple state and control functions
 */
function useRipple(): {
    ripples: RippleData[],
    createRipple: PointerEventHandler,
    destroyRipple: () => void
} {
    const [ripples, setRipples] = useState<RippleData[]>([]);

    const createRipple: PointerEventHandler = (event) => {
        let key = Date.now()
        let DOMRect = event.currentTarget.getBoundingClientRect()
        setRipples(ripples => [...ripples, {
            key,
            position: {
                left: event.clientX - DOMRect.left,
                top: event.clientY - DOMRect.top
            },
            radius: Math.sqrt(DOMRect.height ** 2 + DOMRect.width ** 2),
            nodeRef: createRef(),
        }]);
    };

    const destroyRipple = () => {
        setTimeout(() => setRipples(ripples => ripples.slice(1)), 100)
        
    }
    return {
        ripples,
        createRipple,
        destroyRipple
    }
}

export default useRipple