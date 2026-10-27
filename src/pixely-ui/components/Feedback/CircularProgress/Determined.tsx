import '../../../global.css'
import type { CSSProperties } from "react";
import Wrapper from "../../Utils/Decorator/Decorator";

export interface DeterminedCircularProgressProps {
    style?: CSSProperties,
    className?: string,
    size: number,
    color: string,
    value: number,
    strokeWidth: number,
    strokeLinecap: 'butt' | 'round',
    trackOpacity: number,
    indicator: boolean | React.ReactNode,
    offsetDegree: number,
}

const Determined: React.FC<DeterminedCircularProgressProps> = ({
    style,
    className,
    size,
    color,
    value,
    strokeWidth,
    strokeLinecap,
    trackOpacity,
    indicator,
    offsetDegree
}) => {
    strokeWidth = Math.min(strokeWidth, size / 2)
    let circumference = Math.PI * (size - strokeWidth)
    let dashoffset = circumference - ((Math.max(Math.min(value, 100), 0) / 100) * circumference);
    let svg = (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', color, margin: 'auto' }}>
            {trackOpacity !== 0 ? 
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={(size - strokeWidth) / 2}
                    stroke='currentColor'
                    opacity={trackOpacity}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                : null
            }
            <circle
                cx={size / 2}
                cy={size / 2}
                r={(size - strokeWidth) / 2}
                stroke='currentColor'
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap={strokeLinecap}
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0,.8,.2,1)', transform: `rotate(${offsetDegree}deg)`, transformOrigin: 'center'}}
            />
        </svg>
    )
    if(indicator === true) return (
        <Wrapper className={className} style={style} decoration={<div style={{height: '100%', width: '100%', display: 'flex'}}><span style={{fontSize: `${size / 32 * 8}px`, margin: 'auto'}}>{`${value}%`}</span></div>}>
            <div className='PixelyUI PixelyCircularProgress-Container' style={{height: size, width: size}}>
                {svg}
            </div>
        </Wrapper>
    )
    else if(indicator) return (
        <Wrapper className={className} style={style} decoration={indicator}>
            <div className='PixelyUI PixelyCircularProgress-Container' style={{height: size, width: size}}>
                {svg}
            </div>
        </Wrapper>
    )
    else return (
        <div className={`PixelyUI PixelyCircularProgress-Container ${className}`} style={{height: size, width: size, ...style}}>
            {svg}
        </div>
    )
}

export default Determined