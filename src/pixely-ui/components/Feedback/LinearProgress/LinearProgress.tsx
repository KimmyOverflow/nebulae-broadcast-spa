import '../../../global.css'
import type { CSSProperties, ReactNode } from "react";
import Wrapper from "../../Utils/Decorator/Decorator";
import Infinite from './Infinite';
import Determined from './Determined';

export interface LinearProgressProps {
    /** Progress value from 0 to 100. Displaying a infinite loading bar if this leaves empty. */
    value?: number,
    /** Length in pixel. */
    length?: number,
    color?: string,
    /** The stroke width or the dot diameter in pixel. */
    strokeWidth?: number,
    /** The stroke linecap style.
     * <br>
     * **Only works when `value` is set.**
     */
    strokeLinecap?: 'butt' | 'round',
    /** Set the opacity of the progress track. Set it to zero to skip rendering the track.
     * <br>
     * **Only works when `value` is set.** */
    trackOpacity?: number,
    label?: string | ReactNode,
    labelPosition?: 'top' | 'bottom' | 'left' | 'right',
    children?: ReactNode,
    className?: string,
    style?: CSSProperties,
}

const FLEX_DIRECTION = {
    'top': 'column-reverse',
    'bottom': 'column',
    'left': 'row-reverse',
    'right': 'row'
} as const

const LinearProgress: React.FC<LinearProgressProps> = ({
    value,
    length = 200,
    color = '#323232',
    strokeWidth = 4,
    strokeLinecap = 'butt',
    trackOpacity = 0.16,
    label,
    labelPosition = 'top',
    children,
    className,
    style
}: LinearProgressProps) => {
    let variant: React.ReactNode
    if(value === undefined) variant = <Infinite className={className} style={style} length={length} color={color} strokeWidth={strokeWidth}/>
    else variant = <Determined className={className} style={style} length={length} value={value} color={color} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} trackOpacity={trackOpacity}/>

    if(children) {
        // TODO: label only get rendered when children is not empty. Consider making it always rendered so users can use it as a progress indicator.
        // TODO: only wrap label with <p> when label is a string.
        if(typeof label === 'string') return (
            <Wrapper decorationContainerStyle={{display: 'flex'}} decoration={<div style={{display: 'flex', flexDirection: FLEX_DIRECTION[labelPosition], margin: 'auto', alignItems: 'center', gap: '8px'}}>{variant}<p className='PixelyUI PixelyLinearProgress-Label'>{label}</p></div>}>
                {children}
            </Wrapper>
        )
        else return (
            <Wrapper<'div'> as='div' decorationContainerStyle={{display: 'flex'}} decoration={<div style={{display: 'flex', flexDirection: FLEX_DIRECTION[labelPosition], margin: 'auto'}}>{variant}{label}</div>}>
                {children}
            </Wrapper>
        )
    }
    else return variant
}

export default LinearProgress