import { useEffect, useRef, useState, type RefObject } from "react"
import { useSession } from "../session/context"
import { StreamManagerContext } from "./context"
import type { StreamData } from "../../components/headbar/stream-selector"
import type { PlayerRef } from "../../components/player"
import { BASE_URL } from "../../consts"
import { useNotify } from "../notification/context"

interface StreamManagerProviderProps {
    playerRef: RefObject<PlayerRef | null>
    children?: React.ReactNode
}

namespace ServerSentEvent {
    interface Base {
        timestamp: number
    }

    export interface StreamPublished extends Base {
        event: 'api.sse.stream_published',
        payload: {
            user_id: number,
            stream_id: string,
            media_server_id: string,
            name?: string,
            color?: string,
            password_protected: boolean
        }
    }

    export interface StreamEnded {
        event: 'api.sse.stream_ended',
        payload: {
            stream_id: string
        }
    }

    export interface StreamViewerChanged {
        event: 'api.sse.stream_viewer_changed',
        payload: {
            stream_id: string,
            viewers: number[]
        }
    }
}

type ServerSentEvent =
    | ServerSentEvent.StreamPublished
    | ServerSentEvent.StreamEnded
    | ServerSentEvent.StreamViewerChanged

export const StreamManagerProvider: React.FC<StreamManagerProviderProps> = ({ playerRef, children }) => {
    const { session } = useSession()
    const notify = useNotify()
    const [avaliableStreams, setAvaliableStreams] = useState<null | StreamData[]>(null)
    const [currentStreamId, setCurrentStreamId] = useState<string | null>(null)
    const eventSourceRef = useRef<EventSource>(null)
    
    const handlePlay = (streamId: string) => {
        if (!playerRef.current) {
            console.error('直播流播放失败，因为播放器实例的引用为 null.')
            return
        }
        setCurrentStreamId(streamId)
        playerRef.current.play(streamId)
    }
    
    const handleStop = () => {
        if (!playerRef.current) {
            console.error('直播流停止播放失败，因为播放器实例的引用为 null.')
            return
        }
        setCurrentStreamId(null)
        playerRef.current.stop()
    }

    const handleReload = () => {
        if (!playerRef.current) {
            console.error('直播流重新加载失败，因为播放器实例的引用为 null.')
            return
        }
        playerRef.current.reload()
    }
    
    useEffect(() => {
        if (session.status === 'none' || session.status === 'pending') {
            setAvaliableStreams(null)
            return
        }
        if (session.status === 'renewal_pending') return
        (async () => {
            let resp: Response
            let retryCount = 0
            while (true) {
                resp = await fetch(`${BASE_URL}/api/stat/streams`, { credentials: 'include' })
                if (!resp.ok) {
                    notify?.({ content: `尝试获取直播流列表时发生异常。详细信息可在控制台日志中查看。（重试次数：${retryCount}）` })
                    retryCount++
                    return
                }
                break
            }
            setAvaliableStreams((await resp.json() as { streams: StreamData[] }).streams)

            eventSourceRef.current = new EventSource(`${BASE_URL}/api/event/live`)
            eventSourceRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data) as ServerSentEvent
                switch (data.event) {
                    case 'api.sse.stream_published':
                        setAvaliableStreams(streams => {
                            if (streams === null) return streams
                            if (streams.some(stream => stream.stream_id === data.payload.stream_id)) return streams
                            return [...streams, data.payload]
                        })
                        break
                    case "api.sse.stream_ended":
                        setCurrentStreamId(current => {
                            if (current === data.payload.stream_id) {
                                handleStop()
                                return null
                            }
                            return current
                        })
                        setAvaliableStreams(streams => {
                            if (streams === null) return streams
                            return streams.filter(stream => stream.stream_id !== data.payload.stream_id)
                        })
                        break
                    case "api.sse.stream_viewer_changed":
                        setAvaliableStreams(streams => {
                            if (streams === null) return streams
                            return streams.map(stream =>
                                stream.stream_id === data.payload.stream_id
                                    ? { ...stream, viewers: data.payload.viewers }
                                    : stream
                            )
                        })
                        break
                }
            }
            eventSourceRef.current.onerror = () => notify?.({ content: '实时状态更新断开连接' })
        })()
        return () => {
            eventSourceRef.current?.close()
            eventSourceRef.current = null
        }
    }, [session.status])

    return (
        <StreamManagerContext.Provider value={{
            avaliableStreams: avaliableStreams,
            currentlyStreaming: currentStreamId,
            play: handlePlay,
            stop: handleStop,
            reload: handleReload
        }}>
            {children}
        </StreamManagerContext.Provider>
    )
}
