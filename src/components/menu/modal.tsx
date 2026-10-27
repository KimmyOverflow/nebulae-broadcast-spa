import { useRef, type MouseEventHandler } from 'react'
import './modal.css'

import { motion, type HTMLMotionProps } from 'motion/react'
import useMergeRefs from '../../pixely-ui/hooks/useMergeRefs'
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport'

interface ModalContainerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    dimmed?: boolean,
    centered?: boolean,
    onClickOutside?: MouseEventHandler<HTMLDivElement>
    children?: React.ReactNode | ((ref: React.RefObject<Element | null>) => React.ReactNode)
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
    dimmed = false,
    centered = false,
    onClickOutside,
    children,
    onClick,
    ref: forwardedRef,
    ...props
}) => {
    const isMobile = useIsMobileViewport()
    let className = 'modal-container'
    if (centered || isMobile) className += '_centered'
    if (isMobile) dimmed = true

    const innerRef = useRef<HTMLDivElement>(null)
    const ref = useMergeRefs(forwardedRef, innerRef)
    const childRef = useRef<Element>(null)
    const mouseDownElRef = useRef<EventTarget>(null)

    return (
        <motion.div
            className={className}
            initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            animate={ dimmed ? { backgroundColor: 'rgba(0, 0, 0, .33)' } : undefined }
            exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            ref={ref}
            onMouseDown={ev => mouseDownElRef.current = ev.target}
            onClick={ev => {
                onClick?.(ev)
                if (!childRef.current?.contains((mouseDownElRef.current ?? ev.target) as Node)) {
                    onClickOutside?.(ev)
                }
                ev.stopPropagation()
            }}
            {...props}
        >
            {typeof children === 'function' ? children(childRef) : children}
        </motion.div>
    )
}
