import '../../../global.css'
import { type CSSProperties, type RefObject, useRef, useState } from 'react'
import RippleWrapper from '../../Utils/Ripple/RippleWrapper'
import { createPortal } from "react-dom"
import { Transition, type TransitionStatus } from 'react-transition-group'

// TODO: consider split the logic and the presentation into two components.

export interface ImagePresenterProps {
    src: string,
    height?: number,
    width?: number,
    renderTarget?: Element | DocumentFragment
}

const ImagePresenter: React.FC<ImagePresenterProps> = ({
    src,
    height,
    width,
    renderTarget = document.documentElement
}: ImagePresenterProps) => {
    let imageRef = useRef<HTMLImageElement>(null)
    const [inProp, setInProp] = useState<boolean>(false)
    function handleClick() {
        setInProp(inProp => !inProp)
    }
    function handleBlur() {
        setInProp(false)
    }
    return (
        <>
            <RippleWrapper ripplePlacement='after' rippleColor='rgba(255, 255, 255, .2)' onClick={handleClick}>
                <img className='PixelyUI PixelyImagePresenter-ImageElement' style={{height, width}} src={src} ref={imageRef}/>
            </RippleWrapper>
            {createPortal((
                <FullScreenImagePresenter in={inProp} src={src} imageRef={imageRef} onBlur={handleBlur}/>
            ), renderTarget)}
        </>
    )
}

function calcFullScreenImageTransitionStyles(imageRef: RefObject<HTMLImageElement | null>, state: TransitionStatus): CSSProperties {
    if(state == 'exiting' || state == 'exited') {
        let transform = ''
        let rect = imageRef.current!.getBoundingClientRect()
        let naturalWidthHeightRatio = imageRef.current!.naturalWidth / imageRef.current!.naturalHeight
        let clipedWidthHeightRatio = imageRef.current!.width / imageRef.current!.height
        if(Math.abs(clipedWidthHeightRatio - naturalWidthHeightRatio) < 0.01) transform += `
            translateX(${rect.left - (document.documentElement.clientWidth - rect.width) / 2}px)
            translateY(${rect.top - Math.max(0, (document.documentElement.clientHeight - document.documentElement.clientWidth / naturalWidthHeightRatio) / 2, (document.documentElement.clientHeight - imageRef.current!.naturalHeight) / 2)}px)
            scale(${rect.height / Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth / naturalWidthHeightRatio, imageRef.current!.naturalHeight)})
        `
        else if(clipedWidthHeightRatio > naturalWidthHeightRatio) transform += `
            translateX(${rect.left - (document.documentElement.clientWidth - rect.width) / 2}px)
            translateY(${rect.top - (rect.width / naturalWidthHeightRatio - rect.height) / 2 - Math.max(0, (document.documentElement.clientHeight - document.documentElement.clientWidth / naturalWidthHeightRatio) / 2)}px)
            scale(${rect.width / Math.min(document.documentElement.clientWidth, (document.documentElement.clientHeight) * naturalWidthHeightRatio)})
        `
        else transform += `
            translateX(${rect.left - (document.documentElement.clientWidth - rect.width) / 2}px)
            translateY(${rect.top - Math.max(0, (document.documentElement.clientHeight - document.documentElement.clientWidth / naturalWidthHeightRatio) / 2)}px)
            scale(${rect.height / Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth / naturalWidthHeightRatio)})
        `
        return {transform}
    }
    else return {
        transform: 'none'
    }
}

const FULL_SCREEN_IMAGE_PRESENTER_CONTAINER_TRANSITION_STYLES: {[key in TransitionStatus]?: CSSProperties} = {
    'entering': {opacity: 1},
    'entered': {opacity: 1},
    'exiting': {opacity: 0, pointerEvents: 'none'},
    'exited': {opacity: 0, pointerEvents: 'none'}
} as const

const FullScreenImagePresenter: React.FC<{
    imageRef: RefObject<HTMLImageElement | null>,
    src?: string,
    in: boolean,
    onBlur: () => void
}> = ({imageRef, src, in: inProp, onBlur: blur}) => {
    let imageContainerRef = useRef<HTMLDivElement>(null)
    function handleClick() {
        blur()
    }
    return (
        <Transition
            in={inProp}
            timeout={500}
            nodeRef={imageContainerRef}
            unmountOnExit
        >
            {transitionStatus =>  (
                <div
                    ref={imageContainerRef}
                    style={{transition: '.3s', ...FULL_SCREEN_IMAGE_PRESENTER_CONTAINER_TRANSITION_STYLES[transitionStatus]}}
                    className='PixelyUI PixelyImagePresenter-FullScreenContainer'
                    onClick={handleClick}
                >
                    <img
                        className='PixelyUI PixelyImagePresenter-FullScreenImage'
                        style={{maxHeight: `min(100%, ${imageRef.current!.naturalHeight}px)`, maxWidth: `min(100%, ${imageRef.current!.naturalWidth}px)`, ...calcFullScreenImageTransitionStyles(imageRef, transitionStatus)}}
                        src={src}
                    />
                </div>
            )}
        </Transition>
    )
}

export default ImagePresenter