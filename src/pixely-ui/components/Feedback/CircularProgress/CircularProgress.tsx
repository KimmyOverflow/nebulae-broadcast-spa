import '../../../global.css'
import type { CSSProperties, ReactNode } from 'react'
import Wrapper from '../../Utils/Decorator/Decorator'
import Infinite from './Infinite'
import Determined from './Determined'

export interface CircularProgressProps {
    /** Progress value from 0 to 100. Displaying a infinite loading circular if this leaves empty. */
    value?: number,
    /** Outer square box edge length in pixel. */
    size?: number,
    color?: string,
    /** The stroke width or the dot diameter in pixel, if you are not satisfied with auto calculated values.
     * <br>
     * You can also set it to one half of the size to make it a pie, when `value` is set.
     */
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
    /** Show an progress indicator, or bring your own indicator component.
     * <br>
     * **Only works when `value` is set.** */
    indicator?: boolean | ReactNode, // TODO: Change this to `label` for more versatility and consistency.
    /** Change the start position of the progress.
     * <br>
     * **Only works when `value` is set.** */
    offsetDegree?: number,
    children?: ReactNode,
    className?: string,
    style?: CSSProperties,
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 32,
    color = '#323232',
    strokeWidth = (size / 32) * 4,
    strokeLinecap = 'butt',
    value,
    trackOpacity = .16,
    indicator = false,
    offsetDegree = 0,
    children,
    className,
    style
}: CircularProgressProps) => {
    let variant: React.ReactNode
    if(value === undefined) variant = <Infinite style={style} className={className} size={size} color={color} strokeWidth={strokeWidth}/>
    else variant = <Determined style={style} className={className} size={size} color={color} value={value} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} trackOpacity={trackOpacity} indicator={indicator} offsetDegree={offsetDegree}/>

    if(children) return (
        <Wrapper<'div'> as='div' decorationContainerStyle={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} decoration={variant}>
            {children}
        </Wrapper>
    )
    else return variant

}

export default CircularProgress