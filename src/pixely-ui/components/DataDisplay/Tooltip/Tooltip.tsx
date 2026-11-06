import '../../../global.css'
import type { PopoverPlacement } from '../Popover'

export interface TooltipProps {
    placement: PopoverPlacement,
    text?: string,
    noArrow?: boolean,
}

const Tooltip: React.FC<TooltipProps> = ({
    placement,
    text = 'Insert Text Here',
    noArrow = false,
}: TooltipProps) => {
    let flexDirection: React.CSSProperties['flexDirection'], svgStyle: React.CSSProperties = {}
    switch(placement) {
        case 'top':
        case 'top_start':
        case 'top_end':
            flexDirection = 'column'
            svgStyle.marginTop = '-8px'
            break
        case 'left':
        case 'left_start':
        case 'left_end':
            flexDirection = 'row'
            svgStyle.marginLeft = '-8px'
            break
        case 'right':
        case 'right_start':
        case 'right_end':
            flexDirection = 'row-reverse'
            svgStyle.marginRight = '-8px'
            break
        case 'bottom':
        case 'bottom_start':
        case 'bottom_end':
            flexDirection = 'column-reverse'
            svgStyle.marginBottom = '-8px'
            break
        default:
            flexDirection = 'column'
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
        <div className='PixelyUI PixelyTooltip-Container' style={{flexDirection}}>
            <div className='PixelyUI PixelyTooltip-Textbox'>
                {text}
            </div>
            {noArrow ? null : (
                <div className='PixelyUI PixelyTooltip-ArrowContainer'>
                    <svg width='16' height='16' className='PixelyUI PixelyTooltip-Arrow' style={svgStyle}>
                        <path d='M8 0 L16 8 L8 16 L0 8 Z' fill='currentColor' />
                    </svg>
                </div>
            )}
        </div>
    )
}

export default Tooltip