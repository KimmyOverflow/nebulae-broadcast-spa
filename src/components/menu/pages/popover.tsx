import { motion, type HTMLMotionProps, type TargetAndTransition } from 'motion/react'
import { type RefObject } from 'react'
import './popover.css'
import { useIsMobileViewport } from '../../../hooks/useIsMobileViewport'

interface PopoverProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode,
    anchor: { top: number, right: number },
    arrowYOffset?: number,
    ref?: RefObject<HTMLDivElement | null>
}

export const Popover: React.FC<PopoverProps> = ({
    children,
    anchor,
    ref,
    className
}) => {
    const isMobile = useIsMobileViewport()
    return (
        <motion.div
            ref={ref}
            className={`popover-dialogue-bubble ${className ?? ''}`}
            initial={ isMobile ? { opacity: 0, scale: .9, filter: 'blur(8px)' } : { x: 8, opacity: 0 }}
            animate={ isMobile ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { x: 0, opacity: 1 }}
            exit={ isMobile ? { opacity: 0, scale: .9, filter: 'blur(8px)' } : { x: 8, opacity: 0 }}
            transition={{ duration: .3, ease: [.05, .7, .1, 1] }}
            style={anchor}
        >
            <div className='popover-content'>
                {children}
            </div>
        </motion.div>
    )
}
