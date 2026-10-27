import { useEffect, useRef, useState, type MouseEventHandler, type ReactNode, type Ref, type UIEventHandler } from 'react'
import './style.css'
import { RippleWrapper } from '../../../pixely-ui'

import IconBack from '../../../assets/back.svg?react'
import { motion, usePresenceData } from 'motion/react'

interface MenuPageProps {
    ref?: Ref<HTMLDivElement>
    header?: string,
    onBack?: () => void,
    children: ReactNode
}

export const MenuPage: React.FC<MenuPageProps> = ({
    ref,
    header,
    onBack,
    children,
}) => {
    const direction: 1 | -1 = usePresenceData()
    const contentRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [scrollbarPosition, setScrollbarPosition] = useState(0)
    const [scrollbarHeight, setScrollbarHeight] = useState(100)
    
    const update = () => {
        if (!contentRef.current) return
        setScrollbarHeight(Math.round((contentRef.current.clientHeight / contentRef.current.scrollHeight) * 1000) / 10)
    }

    useEffect(() => {
        if (!contentRef.current) return
        if (!wrapperRef.current) return
        const observer = new ResizeObserver(update)
        observer.observe(wrapperRef.current)
        observer.observe(contentRef.current)
        if (contentRef.current.scrollHeight > contentRef.current.clientHeight) {
            update()
        }
        return () => {
            observer.disconnect()
        }
    }, [])

    const handleScroll: UIEventHandler<HTMLDivElement> = (ev) =>
        setScrollbarPosition(Math.round((ev.currentTarget.scrollTop / ev.currentTarget.scrollHeight) * 1000) / 10)
    
    const handleHeaderDoubleClick = () =>
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <motion.div
            className='menu-page'
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: .3, ease: [.05, .7, .1, 1] }}
        >
            {header !== undefined ? (
                <div className='menu-page__header' onDoubleClick={handleHeaderDoubleClick}>
                    {onBack !== undefined ? (
                        <RippleWrapper onClick={onBack}>
                            <IconBack color='white' />
                        </RippleWrapper>
                    ) : null}
                    <span>{header}</span>
                </div>
            ) : null}
            <div
                className='menu-page__content'
                ref={node => {
                    contentRef.current = node
                    if (!ref) return
                    if (typeof ref === 'function') ref(node)
                    else ref.current = node
                }}
                onScroll={handleScroll}
            >
                <div className='menu-page__content__wrapper' ref={wrapperRef}>
                    {children}
                </div>
            </div>
            <div
                className='menu-page__scrollbar'
                style={{
                    opacity: scrollbarHeight < 100 ? 1 : 0,
                    height: `calc((100% - 37px) * ${scrollbarHeight} / 100)`,
                    top: `calc((100% - 37px) * ${scrollbarPosition} / 100 + 37px)`,
                }}
            />
        </motion.div>
    )
}

export const MenuSection: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <div className='menu-page__entry-section'>
            {children}
        </div>
    )
}

export const MenuEntry: React.FC<{
    children: React.ReactNode
    onClick?: MouseEventHandler<HTMLDivElement>
}> = ({
    children,
    onClick
}) => (
    <RippleWrapper
        className='menu-page__entry-section__entry'
        onClick={onClick}
    >
        {children}
    </RippleWrapper>
)
