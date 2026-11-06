import '../../../global.css'
import { useEffect, useRef, useState } from "react"
import { type PopoverPlacement } from "."
import { createPortal } from "react-dom"
import PopoverTransition from './PopoverTransition'
import PositionedOverlay from '../../Utils/PositionedOverlay/PositionedOverlay'

export interface AnchoredPopoverProps {
    children: (anchorRef: React.RefObject<Element | null>) => React.ReactNode,
    content?: React.ReactNode,
    renderTarget?: Element | DocumentFragment,
    placement?: PopoverPlacement,
    offset?: number,
    noArrow?: boolean,
    in?: boolean,
}

function calcPos(rect: DOMRect, placement: PopoverPlacement) {
    let x = rect.left
    let y = rect.top

    switch (placement) {
        case 'top':
            x += rect.width / 2
            break
        case 'bottom':
            x += rect.width / 2
            y += rect.height
            break
        case 'left':
            y += rect.height / 2
            break
        case 'top_end':
            x += rect.width
            break
        case 'bottom_start':
            y += rect.height
            break
        case 'bottom_end':
            x += rect.width
            y += rect.height
            break
        case 'left_end':
            y += rect.height
            break
        case 'right':
            x += rect.width
            y += rect.height / 2
            break
        case 'right_start':
            x += rect.width
            break
        case 'right_end':
            x += rect.width
            y += rect.height
            break
        default:
            break
    }

    return { x, y }

}

export const AnchoredPopover: React.FC<AnchoredPopoverProps> = ({
    children,
    content,
    renderTarget = document.documentElement,
    placement = 'top',
    offset = 8,
    in: inProp = false
}: AnchoredPopoverProps) => {
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const childRef = useRef<Element>(null)

    useEffect(() => {
        setPos(calcPos(childRef.current!.getBoundingClientRect(), placement))
    }, [inProp])

    return (
        <>
            {createPortal((
                <PopoverTransition in={inProp} placement={placement}>
                    {(ref, style) => (
                        <PositionedOverlay<'div'>
                            as='div'
                            ref={r => { ref.current = r }}
                            style={style}
                            placement={placement}
                            pos={pos}
                            offset={offset}
                        >
                            {content}
                        </PositionedOverlay>
                    )}
                </PopoverTransition>
            ), renderTarget)}
            {children(childRef)}
        </>
    )
}

export default AnchoredPopover
