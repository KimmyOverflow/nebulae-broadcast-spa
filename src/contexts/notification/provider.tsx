import './style.css'

import { useRef, useState, type Ref } from "react"
import { NotificationContext, type NotificationData } from "./context"
import { motion, AnimatePresence } from "motion/react"

const DEFAULT_NOTIFICATION_DURATION = 4000

export const NotificationProvider: React.FC<{ ref?: Ref<HTMLDivElement>, children: React.ReactNode }> = ({ ref, children }) => {
    const counterRef = useRef(0)
    const [notificationBuffer, setNotificationBuffer] = useState<{
        id: number,
        data: NotificationData,
        timer: number | null
    }[]>([])
    const remove = (id: number) => {
        setNotificationBuffer(buffer => buffer.filter(item => item.id !== id))
    }
    const stopTimer = (id: number) => {
        setNotificationBuffer(buffer => buffer.map(item => {
            if (item.id === id) {
                clearTimeout(item.timer ?? undefined)
                return {
                    ...item,
                    timer: null
                }
            } else return item
        }))
    }
    const resetTimer = (id: number) => {
        setNotificationBuffer(buffer => buffer.map(item => {
            if (item.id === id) {
                clearTimeout(item.timer ?? undefined)
                const newTimer = setTimeout(() => remove(id), item.data.duration ?? DEFAULT_NOTIFICATION_DURATION)
                return {
                    ...item,
                    timer: newTimer
                }
            } else return item
        }))
    }
    const notify = (data: NotificationData) => {
        const id = counterRef.current
        const timer = setTimeout(() => remove(id), data.duration ?? DEFAULT_NOTIFICATION_DURATION)
        setNotificationBuffer(buffer => [{ id, data, timer }, ...buffer])
        counterRef.current++
    }

    return (
        <NotificationContext.Provider value={{ notify }}>
            <div className='notification-container' ref={ref}>
                <AnimatePresence>
                    {notificationBuffer.map(item => (
                        <motion.div
                            key={item.id}
                            className='notification'
                            onPointerEnter={() => stopTimer(item.id)}
                            onPointerLeave={() => resetTimer(item.id)}
                            initial={{ x: -48, opacity: 0, filter: 'blur(12px)' }}
                            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ x: -48, opacity: 0, filter: 'blur(12px)' }}
                            transition={{ duration: .5, ease: [.05, .7, .1, 1] }}
                            layout
                        >
                            <div className='notification__main'>
                                {item.data.title && <span className='notification__main__title'>{item.data.title}</span>}
                                {item.data.content && <span className='notification__main__content'>{item.data.content}</span>}
                                {item.data.addition && <span className='notification__main__addition'>{item.data.addition}</span>}
                            </div>
                            {(item.data.duration ?? DEFAULT_NOTIFICATION_DURATION) > 2000 && (
                                <div className='notification__countdown-container'>
                                    <motion.div
                                        className='notification__countdown-bar'
                                        initial={{ x: 0 }}
                                        animate={{ x: item.timer === null ? 0 : '-100%' }}
                                        transition={{
                                            duration: item.timer === null
                                                ? .3
                                                : (item.data.duration ?? DEFAULT_NOTIFICATION_DURATION) / 1000,
                                            ease: item.timer === null
                                                ? [.05, .7, .1, 1]
                                                : 'linear'
                                        }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {children}
        </NotificationContext.Provider>
    )
}
