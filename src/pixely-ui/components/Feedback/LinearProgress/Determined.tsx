import '../../../global.css'
import type { CSSProperties } from "react"

export interface DeterminedLinearProgressProps {
    style?: CSSProperties,
    className?: string,
    length: number,
    value: number,
    color: string,
    strokeWidth: number,
    strokeLinecap: 'butt' | 'round',
    trackOpacity: number
}

const Determined: React.FC<DeterminedLinearProgressProps> = ({
    style,
    className,
    length,
    value,
    color,
    strokeWidth,
    strokeLinecap,
    trackOpacity
}) => {
    return (
        <div className={`PixelyUI PixelyLinearProgress-Container ${className}`} style={{height: `${strokeWidth}px`, width: `${length}px`, borderRadius: strokeLinecap === 'round' ? `${strokeWidth / 2}px` : 0, ...style}}>
            <div className='PixelyUI PixelyLinearProgress-Track' style={{backgroundColor: color, opacity: trackOpacity}}/>
            <div className='PixelyUI PixelyLinearProgress-Progress' style={{backgroundColor: color, transform: `translateX(-${100 - Math.max(Math.min(value, 100), 0)}%)`}}/>
        </div>
    )
}

export default Determined