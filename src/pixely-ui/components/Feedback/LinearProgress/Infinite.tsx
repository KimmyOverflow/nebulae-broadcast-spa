import '../../../global.css'
import type { CSSProperties } from "react"

export interface InfiniteLinearProgressProps {
    style?: CSSProperties,
    className?: string,
    length: number,
    color: string,
    strokeWidth: number
}

const Infinite: React.FC<InfiniteLinearProgressProps> = ({
    style,
    className,
    length,
    color,
    strokeWidth
}) => {
    return (
        <div className={`PixelyUI PixelyLinearProgress-Container ${className}`} style={{height: `${strokeWidth}px`, width: `${length}px`, ...style}}>
            <div className='PixelyUI PixelyLinearProgress-DotContainer'>
                {[0,1,2,3,4].map(index => (
                    <svg key={index} className='PixelyUI PixelyLinearProgress-Dot' xmlns="http://www.w3.org/2000/svg">
                        <circle cx={0} cy={strokeWidth / 2} r={strokeWidth / 2} fill={color}/>
                    </svg>
                ))}
            </div>
        </div>
    )
}

export default Infinite