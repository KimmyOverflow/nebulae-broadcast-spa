import { type CSSProperties, type RefObject, useRef } from "react";
import { Transition, type TransitionStatus } from "react-transition-group";
import type { PopoverPlacement } from ".";

export interface PopoverTransitionProps {
    in: boolean,
    placement: PopoverPlacement,
    children: (ref: RefObject<HTMLElement | null>, transitionStyle: CSSProperties) => React.ReactNode,
}

const PopoverTransition: React.FC<PopoverTransitionProps> = ({
    in: inProp,
    placement,
    children
}) => {
    const nodeRef = useRef<HTMLElement>(null)
    return (
        <Transition nodeRef={nodeRef} in={inProp} timeout={300} unmountOnExit>
            {transitionStatus => children(nodeRef, getPopoverTransitionStyles(placement, transitionStatus))}
        </Transition>
    )
}

export default PopoverTransition

const getPopoverTransitionStyles = (popoverPlacement: PopoverPlacement, transitionStatus: TransitionStatus): CSSProperties => {
    const baseStyle = {
        transition: 'transform .3s cubic-bezier(0, .8, .2, 1), opacity .3s cubic-bezier(0, .8, .2, 1)'
    }

    const placement = popoverPlacement.split('_')[0] as 'top' | 'bottom' | 'left' | 'right'
    
    const transitionStyles: { [key in TransitionStatus]: React.CSSProperties } = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 },
        unmounted: { opacity: 0 }
    }

    switch (placement) {
        case 'top':
            return {
                ...baseStyle,
                ...transitionStyles[transitionStatus],
                transform: transitionStatus === 'entered' || transitionStatus === 'entering'
                    ? 'translateY(0)'
                    : 'translateY(4px)'
            }
        case 'bottom':
            return {
                ...baseStyle,
                ...transitionStyles[transitionStatus],
                transform: transitionStatus === 'entered' || transitionStatus === 'entering'
                    ? 'translateY(0)'
                    : 'translateY(-4px)'
            }
        case 'left':
            return {
                ...baseStyle,
                ...transitionStyles[transitionStatus],
                transform: transitionStatus === 'entered' || transitionStatus === 'entering'
                    ? 'translateX(0)'
                    : 'translateX(4px)'
            }
        case 'right':
            return {
                ...baseStyle,
                ...transitionStyles[transitionStatus],
                transform: transitionStatus === 'entered' || transitionStatus === 'entering'
                    ? 'translateX(0)'
                    : 'translateX(-4px)'
            }
        default:
            return baseStyle
    }
}
