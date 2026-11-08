import '../../../global.css'
import type { PopoverPlacement } from '../../DataDisplay/Popover'
import './style.css'
import type { ElementType } from 'react'

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

// pos 是 anchor 上的对齐点（视口坐标）。translate 的百分比以元素自身 border box 为参照，
// 所以这里不需要测量元素尺寸，内容尺寸变化时浏览器会自动重新解析。
function calculateTranslate(
    pos: { x: number, y: number },
    placement: PositionedOverlayPlacement,
    offset: number
) {
    const { x, y } = pos
    const nx = `${x}px`
    const ny = `${y}px`
    // 分别表示「减自身宽/高」「加间距」
    const xHalf = `calc(${nx} - 50%)`
    const xFull = `calc(${nx} - 100%)`
    const yHalf = `calc(${ny} - 50%)`
    const yFull = `calc(${ny} - 100%)`
    const yBelow = `calc(${ny} + ${offset}px)`
    const yAbove = `calc(${ny} - 100% - ${offset}px)`
    const xAfter = `calc(${nx} + ${offset}px)`
    const xBefore = `calc(${nx} - 100% - ${offset}px)`

    switch (placement) {
        case 'top':
            return `${xHalf} ${yAbove}`
        case 'bottom':
            return `${xHalf} ${yBelow}`
        case 'left':
            return `${xBefore} ${yHalf}`
        case 'right':
            return `${xAfter} ${yHalf}`
        case 'top_start':
            return `${nx} ${yAbove}`
        case 'top_end':
            return `${xFull} ${yAbove}`
        case 'bottom_start':
            return `${nx} ${yBelow}`
        case 'bottom_end':
            return `${xFull} ${yBelow}`
        case 'left_start':
            return `${xBefore} ${ny}`
        case 'left_end':
            return `${xBefore} ${yFull}`
        case 'right_start':
            return `${xAfter} ${ny}`
        case 'right_end':
            return `${xAfter} ${yFull}`
        case 'center':
            return `${xHalf} ${yHalf}`
        default:
            return ''
    }
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
    const Element = as || 'div'

    return (
        <Element
            ref={forwardedRef}
            className={`PixelyUI PixelyPositionedOverlay${className ? ` ${className}` : ''}`}
            style={{
                translate: calculateTranslate(pos, placement, offset),
                ...style
            }}
            {...elementProps}
        >
            {children}
        </Element>
    )
}

export default PositionedOverlay
