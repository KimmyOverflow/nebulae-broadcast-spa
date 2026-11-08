import '../../../global.css'
import { type PopoverPlacement } from "."
import { createPortal } from "react-dom"
import PopoverTransition from './PopoverTransition'
import PositionedOverlay from '../../Utils/PositionedOverlay/PositionedOverlay'
import { useMeasure } from '../../../hooks/useMeasure'
import PopoverBubble from './PopoverBubble'
import type { CSSProperties } from 'react'

export interface AnchoredPopoverProps {
    children: (anchorRef: React.RefObject<Element | null>) => React.ReactNode,
    content?: React.ReactNode,
    bubbleColor?: CSSProperties['color']
    renderTarget?: Element | DocumentFragment,
    placement?: PopoverPlacement,
    offset?: number,
    in?: boolean,
}

export const AnchoredPopover: React.FC<AnchoredPopoverProps> = ({
    children,
    content,
    bubbleColor = 'white',
    renderTarget = document.documentElement,
    placement = 'top',
    offset = 8,
    in: inProp = false
}: AnchoredPopoverProps) => {
    const [measureTargetRef, result] = useMeasure(placement)
    let arrowOffset = 0
    if (result) {
        switch (placement) {
            case 'top_start':
            case 'top_end':
            case 'bottom_start':
            case 'bottom_end':
                arrowOffset = result.rect.width / 2
                break
            case 'left_start':
            case 'left_end':
            case 'right_start':
            case 'right_end':
                arrowOffset = result.rect.height / 2
                break
        }
    }
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
                            pos={result?.anchorPoint ?? { x: 0, y: 0}}
                            offset={offset}
                        >
                            <PopoverBubble
                                bubbleColor={bubbleColor}
                                placement={placement}
                                arrowOffset={arrowOffset}
                            >
                                {content}
                            </PopoverBubble>
                        </PositionedOverlay>
                    )}
                </PopoverTransition>
            ), renderTarget)}
            {children(measureTargetRef)}
        </>
    )
}

export default AnchoredPopover
