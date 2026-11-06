import '../../../global.css'
import { useEffect, useRef, useState } from "react"
import type { PopoverPlacement } from '../Popover'
import PopoverTransition from '../Popover/PopoverTransition'
import Tooltip from "./Tooltip"
import { createPortal } from "react-dom"
import PositionedOverlay from '../../Utils/PositionedOverlay/PositionedOverlay'

export interface TooltipWrapperProps {
    children: (ref: React.RefObject<Element | null>) => React.ReactNode,
    renderTarget?: Element | DocumentFragment,
    placement?: PopoverPlacement,
    offset?: number,
    text?: string,
    noArrow?: boolean,
}

function calcAnchorPoint(rect: DOMRect, placement: PopoverPlacement) {
    let top = rect.top
    let left = rect.left

    switch (placement) {
        case 'top':
            left += rect.width / 2
            break
        case 'bottom':
            top += rect.height
            left += rect.width / 2
            break
        case 'left':
            top += rect.height / 2
            break
        case 'top_end':
            left += rect.width
            break
        case 'bottom_start':
            top += rect.height
            break
        case 'bottom_end':
            top += rect.height
            left += rect.width
            break
        case 'left_end':
            top += rect.height
            break
        case 'right':
            top += rect.height / 2
            left += rect.width
            break
        case 'right_start':
            left += rect.width
            break
        case 'right_end':
            top += rect.height
            left += rect.width
            break
        default:
            break
    }

    return { top, left }

}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
    children,
    renderTarget = document.documentElement,
    placement = 'top',
    offset = 8,
    text,
    noArrow = false,
}: TooltipWrapperProps) => {
    const [isShow, setShow] = useState(false)
    const [anchorPoint, setAnchorPoint] = useState({ top: 0, left: 0 })
    const childRef = useRef<Element>(null)

    const mouseEnterHandler = () => {
        setAnchorPoint(calcAnchorPoint(childRef.current!.getBoundingClientRect(), placement))
        setShow(true)
    }
    const mouseLeaveHandler = () => {
        setShow(false)
    }
    useEffect(() => {
        childRef.current?.addEventListener('mouseenter', mouseEnterHandler)
        childRef.current?.addEventListener('mouseleave', mouseLeaveHandler)
        return () => {
            childRef.current?.removeEventListener('mouseenter', mouseEnterHandler)
            childRef.current?.removeEventListener('mouseleave', mouseLeaveHandler)
        }
    }, [])
    return (
        <>
            {createPortal((
                <PopoverTransition in={isShow} placement={placement}>
                    {(ref, style) => (
                        <PositionedOverlay
                            ref={node => { ref.current = node }}
                            style={style}
                            placement={placement}
                            pos={{ x: anchorPoint.left, y: anchorPoint.top }}
                            offset={offset}
                        >
                            <Tooltip placement={placement} text={text} noArrow={noArrow}/>
                        </PositionedOverlay>
                    )}
                </PopoverTransition>
            ), renderTarget)}
            {children(childRef)}
        </>
    )
}

export default TooltipWrapper