import type { CSSProperties } from 'react'
import '../../../global.css'
import type { PopoverPlacement } from '.'

export interface PopoverBubbleProps {
    color?: CSSProperties['color']
    placement?: PopoverPlacement,
    children?: React.ReactNode
}

export const PopoverBubble: React.FC<PopoverBubbleProps> = ({
    color = 'white',
    placement = 'top',
    children
}: PopoverBubbleProps) => {
    let containerStyle: React.CSSProperties = {}
    let svgStyle: React.CSSProperties = {}

    containerStyle.color = color
    switch(placement) {
        case 'top':
        case 'top_start':
        case 'top_end':
            containerStyle.flexDirection = 'column'
            svgStyle.marginTop = '-8px'
            break
        case 'left':
        case 'left_start':
        case 'left_end':
            containerStyle.flexDirection = 'row'
            svgStyle.marginLeft = '-8px'
            break
        case 'right':
        case 'right_start':
        case 'right_end':
            containerStyle.flexDirection = 'row-reverse'
            svgStyle.marginRight = '-8px'
            break
        case 'bottom':
        case 'bottom_start':
        case 'bottom_end':
            containerStyle.flexDirection = 'column-reverse'
            svgStyle.marginBottom = '-8px'
            break
        default:
            containerStyle.flexDirection = 'column'
    }
    switch(placement) {
        case 'top_start':
        case 'bottom_start':
            svgStyle.marginLeft = '-8px'
            break
        case 'top_end':
        case 'bottom_end':
            svgStyle.marginRight = '-8px'
            break
        case 'left_start':
        case 'right_start':
            svgStyle.marginTop = '-8px'
            break
        case 'left_end':
        case 'right_end':
            svgStyle.marginBottom = '-8px'
            break
        default:
            break
    }

    return (
        <div className='PixelyUI PixelyPopoverBubble-Container' style={containerStyle}>
            <div className='PixelyUI PixelyPopoverBubble-Textbox'>
                {children}
            </div>
            <div className='PixelyUI PixelyPopoverBubble-ArrowContainer'>
                <svg width='16' height='16' className='PixelyUI PixelyPopoverBubble-Arrow' style={svgStyle}>
                    <path d='M8 0 L16 8 L8 16 L0 8 Z' fill='currentColor' />
                </svg>
            </div>
        </div>
    )
}

export default PopoverBubble
