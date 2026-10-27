import '../../../global.css'
import { type ComponentPropsWithRef, useEffect } from 'react'
import { RipplePool, useRipple } from '../../Utils/Ripple'
import { Decorator } from '../../Utils/Decorator'

export interface SelectBoxProps extends ComponentPropsWithRef<'div'> {
    focusd?: boolean,
    selected?: string,
    placeholder?: string,
    className?: string,
}

const SelectBox: React.FC<SelectBoxProps> = ({
    selected,
    placeholder = 'Click to select...',
    className,
    focusd = false,
    ref,
    onMouseDown,
    ...divProps
}) => {
    const {ripples, createRipple, destroyRipple} = useRipple()
    useEffect(() => {
        if(!focusd) {
            destroyRipple()
        }
    }, [focusd])
    return (
        <Decorator<'div'>
            as='div'
            ref={ref}
            decoration={(
                <RipplePool
                    ripples={ripples}
                    rippleColor='rgba(255,255,255,.8)'
                />
            )}
            decorationPlacement='middle'
            className={`PixelyUI PixelySelectBox ${focusd ? 'PixelySelectBox--Focus' : ''} ${className ? className : ''}`}
            onPointerDown={(ev) => {
                if(!focusd) {
                    createRipple(ev)
                }
                onMouseDown?.(ev)
            }}
            {...divProps}
        >
            {selected ? (
                <p className={`PixelyUI PixelySelectBox-SelectedText ${focusd ? 'PixelySelectBox-SelectedText--Focus' : ''}`}>
                    {selected}
                </p>
            ) : (
                <p className='PixelyUI PixelySelectBox-PlaceholderText'>
                    {placeholder}
                </p>
            )}
            
            <svg height='12' width='12' viewBox='0 0 12 12' className='PixelyUI PixelySelectBox-Arrow'>
                <path d='M2 5 L6 9 L10 5' fill='none' stroke='currentColor' strokeWidth='1.2' />
            </svg>
        </Decorator>
    )
}

export default SelectBox