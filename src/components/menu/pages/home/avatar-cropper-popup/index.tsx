import AvatarEditor, { useAvatarEditor } from 'react-avatar-editor'
import { useRef, useState, type RefObject, type WheelEventHandler } from 'react'
import { Button, OutlinedButton } from '../../../../../pixely-ui'
import { ModalContainer } from '../../../modal'
import { Popover } from '../../popover'

interface AvatarCropperPopupProps {
    file: File | null,
    onApply: (image: Blob) => Promise<void>
    onDiscard: () => void
}

export const AvatarCropperPopup: React.FC<AvatarCropperPopupProps> = ({
    file,
    onApply,
    onDiscard,
}) => {
    const editor = useAvatarEditor()
    const [scaleLevel, setScaleLevel] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const handleWheel: WheelEventHandler<HTMLDivElement> = (ev) => {
        setScaleLevel(i => Math.min(i + ev.deltaY, 0))
    }
    const handleApply = () => {
        setIsLoading(true)
        const canvas = editor.getImageScaledToCanvas()
        if (!canvas) return
        console.log(canvas)
        canvas.toBlob(blob => {
            if (!blob) {
                console.error('Failed to encode canvas to blob when cropping avatar image.')
                return
            }
            onApply(blob).then(() => {
                setIsLoading(false)
            })
        }, 'image/webp', 1)
    }
    const popupContainerRef = useRef<HTMLDivElement>(null)
    return (
        <ModalContainer ref={popupContainerRef} onClickOutside={onDiscard}>
            {ref => (
                <Popover className='' ref={ref as RefObject<HTMLDivElement>} anchor={{ top: 52, right: 248 }} >
                    <div style={{ display: 'flex' }} onWheel={handleWheel}>
                        <AvatarEditor
                            showGrid
                            gridColor='rgba(0, 0, 0, .33)'
                            ref={editor.ref}
                            width={160}
                            height={160}
                            border={0}
                            scale={.5 ** (scaleLevel * .01 * .17)}
                            image={file || undefined}
                            borderRadius={80}
                        />
                    </div>
                    <Button loading={isLoading} text='应用' style={{ width: '100%' }} color='#222222' onClick={handleApply} />
                    <OutlinedButton ripple text='取消' style={{ width: '100%' }} color='rgba(255, 255, 255, .5)' onClick={onDiscard} />
                </Popover>
            )}
        </ModalContainer>
    )
}
