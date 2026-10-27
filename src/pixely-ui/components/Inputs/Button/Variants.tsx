import '../../../global.css'
import { useState } from 'react'
import ButtonWrapper from './ButtonWrapper'
import ButtonContent, { type ButtonContentProps } from './ButtonContent'
import type { RippleSettings } from '../../Utils/Ripple'
import Color from 'color'

export interface VariantedButtonProps extends React.ComponentPropsWithoutRef<'button'>, ButtonContentProps {
    color: string,
    ripple: boolean | RippleSettings
}

export const ContainedButton: React.FC<VariantedButtonProps> = ({
    text,
    startIcon,
    endIcon,
    loading,
    color,
    ripple,
    style,
    className,
    ...buttonProps
}) => {
    return (
        <ButtonWrapper
            className={`PixelyUI PixelyButton PixelyButton--Contained ${className}`}
            ripple={ripple}
            blockMouseEvents={loading}
            // TODO: global color management
            style={{color: Color(color).isDark() ? 'white' : '#323232', backgroundColor: color, ...style}}
            {...buttonProps}
        >
            <ButtonContent text={text} startIcon={startIcon} endIcon={endIcon} loading={loading}/>
        </ButtonWrapper>
    )
}

export const OutlinedButton: React.FC<VariantedButtonProps> = ({
    text,
    startIcon,
    endIcon,
    loading,
    color,
    ripple,
    style,
    className,
    ...buttonProps
}) => {
    const [hovered, setHovered] = useState(false);
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    let color1 = Color(color).alpha(.24).toString(),
        color2 = Color(color).alpha(.06).toString()

    if(ripple === true) ripple = {
        rippleColor: color1,
        ripplePlacement: 'after'
    }
    return (
        <ButtonWrapper
            className={`PixelyUI PixelyButton PixelyButton--Outlined ${className}`}
            ripple={loading ? undefined : ripple}
            blockMouseEvents={loading}
            style={{color, borderColor: color, backgroundColor: hovered ? color2 : undefined, ...style}}
            {...buttonProps}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <ButtonContent text={text} startIcon={startIcon} endIcon={endIcon} loading={loading}/>
        </ButtonWrapper>
    )
}

export const TextButton: React.FC<VariantedButtonProps> = ({
    text,
    startIcon,
    endIcon,
    loading,
    color,
    ripple,
    style,
    className,
    ...buttonProps
}) => {
    const [hovered, setHovered] = useState(false);
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    let color1 = Color(color).alpha(.24).toString(),
        color2 = Color(color).alpha(.08).toString()

    if(ripple === true) ripple = {
        rippleColor: color1,
        ripplePlacement: 'after'
    }
    return (
        <ButtonWrapper
            className={`PixelyUI PixelyButton PixelyButton--Text ${className}`}
            ripple={loading ? undefined : ripple}
            blockMouseEvents={loading}
            style={{color, backgroundColor: hovered ? color2 : undefined, ...style}}
            {...buttonProps}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <ButtonContent text={text} startIcon={startIcon} endIcon={endIcon} loading={loading}/>
        </ButtonWrapper>
    )
}