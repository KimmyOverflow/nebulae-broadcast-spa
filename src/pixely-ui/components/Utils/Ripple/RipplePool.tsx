import '../../../global.css'
import { type RefObject } from "react"
import { TransitionGroup, CSSTransition } from "react-transition-group"

export interface RipplePoolProps {
    style?: React.CSSProperties,
    className?: string,
    rippleColor?: React.CSSProperties['color'],
    ripples: RippleData[],
}

export type RippleData = {
    key: number,
    position: {
        top: number
        left: number,
    },
    radius: number,
    /** The ref of the ripple node. */
    nodeRef: RefObject<HTMLDivElement | null>
}

const ANIMATION_CONSTANTS = {
    MIN_TIMEOUT: 500,
    MIN_BLUR: 16,
    MIN_DURATION: 0.5,
    RADIUS_TO_TIMEOUT: 2.5,
    RADIUS_TO_BLUR: 0.08,
    RADIUS_TO_DURATION: 0.0025
} as const

const getTimeout = (radius: number) => {
    return Math.max(radius * ANIMATION_CONSTANTS.RADIUS_TO_TIMEOUT, ANIMATION_CONSTANTS.MIN_TIMEOUT)
}

const getRippleStyle = (position: RippleData['position'], radius: number) => {
    return {
        top: `${position.top - radius}px`,
        left: `${position.left - radius}px`,
        height: `${radius * 2}px`,
        width: `${radius * 2}px`,
        filter: `blur(${Math.max(radius * ANIMATION_CONSTANTS.RADIUS_TO_BLUR, ANIMATION_CONSTANTS.MIN_BLUR)}px)`,
        transitionDuration: `${Math.max(radius * ANIMATION_CONSTANTS.RADIUS_TO_DURATION, ANIMATION_CONSTANTS.MIN_DURATION)}s`
    }
}

export const RipplePool: React.FC<RipplePoolProps> = ({
    style,
    className,
    rippleColor = 'rgba(255, 255, 255, .24)',
    ripples,
}: RipplePoolProps) => {
    return (
        <div className={`PixelyRipplePool ${className ? className : ''}`} style={{color: rippleColor, ...style}}>
            <TransitionGroup component={null} enter exit>
                {ripples.map(({key, position, radius, nodeRef}) => (
                    <CSSTransition
                        key={key}
                        nodeRef={nodeRef}
                        timeout={getTimeout(radius)}
                        classNames={{
                            enter: 'PixelyRippleEffect--Enter',
                            exit: 'PixelyRippleEffect--Exit',
                            enterActive: 'PixelyRippleEffect--EnterActive',
                            exitActive: 'PixelyRippleEffect--ExitActive'
                        }}
                    >
                        <div ref={nodeRef} className='PixelyRippleEffect' style={getRippleStyle(position, radius)}/>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
        
    )
}