import '../../../global.css'
import { RippleWrapper, type RippleSettings } from "../../Utils/Ripple"

interface ButtonWrapperProps extends React.ComponentPropsWithoutRef<'button'> {
    ripple?: boolean | RippleSettings,
    blockMouseEvents?: boolean,
}

// TODO: Ripple effect feedback on keyboard click (part of UI accessibility works)
const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
    children,
    ripple,
    blockMouseEvents = false,
    className,
    ...buttonProps
}: ButtonWrapperProps) => {
    if(ripple) {
        return (
            <RippleWrapper<'button'>
                as='button'
                className={`PixelyUI PixelyButtonWrapper${className ? className : ''}`}
                rippleColor={ripple === true ? undefined : ripple.rippleColor}
                ripplePlacement={ripple === true ? undefined : ripple.ripplePlacement}
                {...buttonProps}
            >
                {children}
            </RippleWrapper>
        )
    }
    else return (
        <button className={`PixelyUI PixelyButtonWrapper ${className}`} {...buttonProps}>
            {children}
        </button>
    )
}

export default ButtonWrapper
