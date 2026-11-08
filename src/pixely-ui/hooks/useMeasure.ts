import { useState, useRef, useLayoutEffect } from "react"

export type AnchorPointPosition =
    | 'top_start'
    | 'top_end'
    | 'bottom_start'
    | 'bottom_end'
    | 'left_start'
    | 'left_end'
    | 'right_start'
    | 'right_end'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'center'

type MeasureResult = {
    rect: DOMRect
    anchorPoint: {
        x: number,
        y: number
    }
}

function calcAnchorPoint(rect: DOMRect, anchorPointPosition: AnchorPointPosition) {
    let x = rect.left
    let y = rect.top

    switch (anchorPointPosition) {
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

export function useMeasure(anchorPointPosition: AnchorPointPosition): [
    target: React.RefObject<Element | null>,
    result: MeasureResult | null
] {
    const [result, setResult] = useState<MeasureResult | null>(null)
    const targetRef = useRef<Element | null>(null)

    // 无依赖数组：每次提交后同步测量，anchor 尺寸/placement 变化都能在 paint 前跟上。
    // anchor 的矩形与被定位元素无关，不会自反馈；容差比较挡掉亚像素抖动。
    useLayoutEffect(() => {
        const node = targetRef.current
        if (!node) return

        const update = () => {
            const rect = node.getBoundingClientRect()
            const { x, y } = calcAnchorPoint(rect, anchorPointPosition)
            setResult(prev => {
                if (prev === null) return {
                    anchorPoint: {x, y},
                    rect
                }
                if (Math.abs(prev.anchorPoint.x - x) <= 0.5 && Math.abs(prev.anchorPoint.y - y) <= 0.5) return prev
                else return { anchorPoint: {x, y}, rect }
            })
        }

        update()

        // anchor 尺寸变化、页面或任意容器滚动、窗口缩放都要重新测量
        const resizeObserver = new ResizeObserver(update)
        resizeObserver.observe(node)
        window.addEventListener('scroll', update, { capture: true, passive: true })
        window.addEventListener('resize', update)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('scroll', update, { capture: true })
            window.removeEventListener('resize', update)
        }
    })
    return [
        targetRef,
        result
    ]
}
