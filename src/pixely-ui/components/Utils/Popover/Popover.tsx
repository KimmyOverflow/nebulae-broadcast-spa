import '../../../global.css'
import { useLayoutEffect, useRef, useState } from 'react'
import useMergeRefs from '../../../hooks/useMergeRefs'

export type PopoverPlacement = 'top_start' | 'top_end' | 'bottom_start' | 'bottom_end' | 'left_start' | 'left_end' | 'right_start' | 'right_end' | 'top' | 'bottom' | 'left' | 'right'

export interface PopoverProps extends React.ComponentPropsWithRef<'div'> {
    anchorPoint: {
        top: number,
        left: number,
    },
    placement: PopoverPlacement,
    offset?: number,
}

const Popover: React.FC<PopoverProps> = ({
    anchorPoint,
    placement,
    offset = 0,
    children,
    style,
    className,
    ref,
    ...divProps
}: PopoverProps) => {
    const internalRef = useRef<HTMLDivElement>(null)

    const mergedRef = useMergeRefs(internalRef, ref ?? null)
    
    const [position, setPosition] = useState({ top: 0, left: 0 })

    const calculatePosition = (placement: PopoverPlacement, anchorPoint: {top: number, left: number}) => {
        if (!internalRef.current) return {top: 0, left: 0}

        const popover = internalRef.current
        const { width, height } = popover.getBoundingClientRect()

        let top = anchorPoint.top
        let left = anchorPoint.left

        switch (placement) {
            case 'top':
                top -= height + offset
                left -= width / 2
                break
            case 'bottom':
                top += offset
                left -= width / 2
                break
            case 'left':
                top -= height / 2
                left -= width + offset
                break
            case 'right':
                top -= height / 2
                left += offset
                break
            case 'top_start':
                top -= height + offset
                break
            case 'top_end':
                top -= height + offset
                left -= width
                break
            case 'bottom_start':
                top += offset
                break
            case 'bottom_end':
                top += offset
                left -= width
                break
            case 'left_start':
                left -= width + offset
                break
            case 'left_end':
                top -= height
                left -= width + offset
                break
            case 'right_start':
                left += offset
                break
            case 'right_end':
                top -= height
                left += offset
                break
            // Add other cases as needed
        }

        return { top, left }
    }

    useLayoutEffect(() => {
        setPosition(calculatePosition(placement, anchorPoint))
    }, [])
    
    return (
        <div
            ref={mergedRef}
            className={`PixelyUI PixelyPopover ${className}`}
            style={{
                top: position.top,
                left: position.left,
                ...style
            }}
            {...divProps}
        >
            {children}
        </div>
    )
}

export default Popover