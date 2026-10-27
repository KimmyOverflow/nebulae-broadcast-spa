import '../../../global.css'
import type { CSSProperties } from "react"

export interface InfiniteCircularProgressProps {
    style?: CSSProperties,
    className?: string,
    size: number,
    color: string,
    strokeWidth: number
}

const Infinite: React.FC<InfiniteCircularProgressProps> = ({
    style,
    className,
    size,
    color,
    strokeWidth,
}) => {
    let dotContainerSize = size / 2 * 1.4142 - strokeWidth / 1.4142
    return (
        <div className={`PixelyUI PixelyCircularProgress-Container ${className}`} style={{...style, height: size, width: size, color}}>
            <div className='PixelyUI PixelyCircularProgress-DotContainer' style={{height: dotContainerSize, width: dotContainerSize}}>
                {[0,1,2,3,4].map(index => {
                    return (
                        <svg key={index} className='PixelyUI PixelyCircularProgress-Dot' xmlns="http://www.w3.org/2000/svg">
                            <circle cx={0} cy={0} r={strokeWidth / 1.6} fill='currentColor'/>
                        </svg>
                    )
                })}
            </div>
        </div>
    )
}

export default Infinite