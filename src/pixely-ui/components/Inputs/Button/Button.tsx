import '../../../global.css'
import { ContainedButton, OutlinedButton, TextButton, type VariantedButtonProps } from './Variants'
import ButtonWrapper from './ButtonWrapper'

export interface ButtonProps extends Partial<VariantedButtonProps> {
    variant?: 'text' | 'outlined' | 'contained',
}

const Button: React.FC<ButtonProps> = ({
    text = 'Insert Text Here',
    startIcon,
    endIcon,
    loading = false,
    color = '#0099BC',
    ripple = true,
    variant = 'contained',
    children,
    style,
    ...buttonProps
}: ButtonProps) => {
    if(children) return (
        <ButtonWrapper
            ripple={ripple}
            style={style}
            {...buttonProps}
        >
            {children}
        </ButtonWrapper>
    )

    switch (variant) {
        case 'contained':
            return <ContainedButton text={text} color={color} startIcon={startIcon} endIcon={endIcon} loading={loading} ripple={ripple} style={style} {...buttonProps}/>
        case 'outlined':
            return <OutlinedButton text={text} color={color} startIcon={startIcon} endIcon={endIcon} loading={loading} ripple={ripple} style={style} {...buttonProps}/>
        case 'text':
            return <TextButton text={text} color={color} startIcon={startIcon} endIcon={endIcon} loading={loading} ripple={ripple} style={style} {...buttonProps}/>
    }
    
}

export default Button