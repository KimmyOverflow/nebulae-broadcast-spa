import type { ComponentPropsWithRef, ElementType } from "react"
import Wrapper from "../Decorator/Decorator"
import useRipple from "./useRipple"
import { RipplePool } from "./RipplePool"

export type RippleSettings = {
    ripplePlacement?: 'before' | 'middle' | 'after',
    rippleColor?: React.CSSProperties['color']
}

export type RippleWrapperProps<T extends ElementType> = ComponentPropsWithRef<T> & {
    as?: T,
} & RippleSettings

const RippleWrapper = <T extends ElementType = 'div'>({
    as,
    children,
    ref,
    ripplePlacement = 'after',
    rippleColor,
    ...props
}: RippleWrapperProps<T>) => {
    const {ripples, createRipple, destroyRipple} = useRipple()
    return (
        <Wrapper
            as={as}
            decorationPlacement={ripplePlacement}
            decoration={<RipplePool ripples={ripples} rippleColor={rippleColor}/>}
            onPointerDown={createRipple}
            onPointerUp={destroyRipple}
            onPointerLeave={destroyRipple}
            ref={ref}
            {...props}
        >
            {children}
        </Wrapper>
    )
}

export default RippleWrapper