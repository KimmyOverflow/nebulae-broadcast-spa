import '../../../global.css'
import type { PopoverPlacement } from '../../DataDisplay/Popover'
import './style.css'
import { useRef, type ElementType } from 'react'

export type PositionedOverlayPlacement = PopoverPlacement | 'center'

export type PositionedOverlayProps<T extends ElementType> = React.ComponentPropsWithRef<T> & {
    as?: T,
    pos: {
        x: number,
        y: number,
    },
    placement: PositionedOverlayPlacement,
    offset?: number,
}

const PositionedOverlay = <T extends ElementType = 'div'>({
    as,
    pos,
    placement,
    offset = 0,
    children,
    style,
    className,
    ref: forwardedRef,
    ...elementProps
}: PositionedOverlayProps<T>) => {
    const ref = useRef<HTMLElement>(null)

    const calculateAbsolutePosition = (pos: { x: number, y: number }, placement: PositionedOverlayPlacement) => {
        let top = 0, left = 0
        if (!ref.current) return { top, left }

        const popover = ref.current
        const { width, height } = popover.getBoundingClientRect()

        switch (placement) {
            case 'top':
                top = pos.y - height - offset
                left = pos.x - width / 2
                break
            case 'bottom':
                top = pos.y + offset
                left = pos.x - width / 2
                break
            case 'left':
                top = pos.y - height / 2
                left = pos.x - width - offset
                break
            case 'right':
                top = pos.y - height / 2
                left = pos.x + offset
                break
            case 'top_start':
                top = pos.y - height - offset
                break
            case 'top_end':
                top = pos.y - height - offset
                left = pos.x - width
                break
            case 'bottom_start':
                top = pos.y + offset
                break
            case 'bottom_end':
                top = pos.y + offset
                left = pos.x - width
                break
            case 'left_start':
                left = pos.x - width - offset
                break
            case 'left_end':
                top = pos.y - height
                left = pos.x - width - offset
                break
            case 'right_start':
                left = pos.x + offset
                break
            case 'right_end':
                top = pos.y - height
                left = pos.x + offset
                break
            case 'center':
                top = pos.y - height / 2
                left = pos.x - width / 2
                break
        }

        return { top, left }
    }

    const absolutePosition = calculateAbsolutePosition(pos, placement)
    const Element = as || 'div'

    return (
        <Element
            ref={(node: HTMLElement | null) => {
                ref.current = node
                if (!forwardedRef) return
                if (typeof forwardedRef === 'function') forwardedRef(node)
                forwardedRef.current = node
            }}
            className={`PixelyUI PixelyPositionedOverlay${className ? ` ${className}` : ''}`}
            style={{
                ...absolutePosition,
                ...style
            }}
            {...elementProps}
        >
            {children}
        </Element>
    )
}

export default PositionedOverlay
