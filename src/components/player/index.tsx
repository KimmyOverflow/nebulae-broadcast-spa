import { forwardRef, useCallback, useImperativeHandle, useRef, useState, type SyntheticEvent } from 'react'
import './style.css'
import { BASE_URL } from '../../consts'

export interface PlayerRef {
    play: (streamId: string) => void
    stop: () => void
    reload: () => void
}

export interface PlayerProps {

}

export const Player = forwardRef<PlayerRef, PlayerProps>((_props, ref) => {
    const [stream, setStream] = useState<MediaStream | null>(null)
    const pcRef = useRef<RTCPeerConnection>(null)
    const videoRef = useCallback((node: HTMLVideoElement | null) => {
        if (node && stream) {
            node.srcObject = stream
        }
    }, [stream])
    const streamIdRef = useRef<string | null>(null)

    const play = async (streamId: string) => {
        streamIdRef.current = streamId

        pcRef.current?.close()
        pcRef.current = null

        const pc = new RTCPeerConnection()
        pcRef.current = pc

        pc.addTransceiver('audio', { direction: 'recvonly' })
        pc.addTransceiver('video', { direction: 'recvonly' })
        pc.ontrack = (event) => setStream(event.streams[0])

        pc.setLocalDescription(await pc.createOffer())
        await new Promise<void>(resolve => {
            if (pc.iceGatheringState === 'complete') {
                resolve()
            } else {
                pc.addEventListener('icegatheringstatechange', () => {
                    if (pc.iceGatheringState === 'complete') {
                        resolve()
                    }
                })
            }
        })

        const response = await fetch(`${BASE_URL}/api/whep?stream=${streamId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/sdp' },
            body: pc.localDescription!.sdp
        })

        if (response.status !== 201) {
            throw new Error(`${response.statusText} ${response.text()}`)
        }

        const sdp = await response.text()
        
        console.log(sdp)

        await pc.setRemoteDescription({
            type: 'answer',
            sdp
        })
    }

    const stop = () => {
        setStream(null)
        pcRef.current?.close()
        streamIdRef.current = null
    }

    const reload = () => {
        if (streamIdRef.current) play(streamIdRef.current)
    }

    useImperativeHandle(ref, () => {
        return { play, stop, reload }
    })

    // Firefox 的原生控件在 UA shadow DOM 里处理画面点击，鼠标事件不会派发到页面
    // （捕获阶段也收不到），所以无法 preventDefault；这里直接把暂停撤销掉，让直播流保持播放。
    const keepPlaying = (ev: SyntheticEvent<HTMLVideoElement>) => {
        const video = ev.currentTarget
        if (video.ended) {
            return
        }
        video.play().catch(() => { })
    }

    return (
        <div className='stream-player-container'>
            {stream !== null ? <video id='stream-player' ref={videoRef} controls autoPlay onPause={keepPlaying} /> : null}
        </div>
    )
})
