import { createRef, useEffect, useRef, useState, type ChangeEventHandler, type ComponentPropsWithoutRef, type FocusEventHandler, type Ref, type RefObject } from "react"
import { Decorator } from "../../Utils/Decorator"
import { RipplePool } from "../../Utils/Ripple"

export interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange'> {
    name?: string,
    required?: boolean,
    type?: React.HTMLInputTypeAttribute,
    placeholder?: string
    defaultValue?: string
    rippleColor?: string
    startSlot?: React.ReactNode
    endSlot?: React.ReactNode
    ref?: Ref<HTMLDivElement>
    onChange?: (value: string) => void
}

const TextField: React.FC<TextFieldProps> = ({
    name,
    required = false,
    type = 'text',
    placeholder,
    defaultValue,
    rippleColor = 'rgba(255,255,255,.8)',
    startSlot,
    endSlot,
    ref: forwardedRef,
    onFocus,
    onBlur,
    onChange,
    ...inputProps
}: TextFieldProps) => {
    useEffect(() => {
        if (defaultValue) {
            inputRef.current?.setAttribute('value', defaultValue)
        }
    }, [])
    const inputRef = useRef<HTMLInputElement>(null)
    const decoratorRef = useRef<HTMLDivElement>(null)
    const [focus, setFocus] = useState<DOMRect | false>(false)
    const handleChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
        onChange?.(ev.target.value)
    }
    const handleFocus: FocusEventHandler<HTMLInputElement> = (ev) => {
        onFocus?.(ev)
        setFocus(decoratorRef.current!.getBoundingClientRect())
    }
    const handleBlur: FocusEventHandler<HTMLInputElement> = (ev) => {
        onBlur?.(ev)
        setFocus(false)
    }

    return (
        <Decorator<'div'>
            as='div'
            ref={node => {
                decoratorRef.current = node
                if (typeof forwardedRef === 'function') forwardedRef(node)
                else if (forwardedRef) forwardedRef.current = node
            }}
            decoration={(
                <RipplePool
                    ripples={focus ? [{
                        key: Date.now(),
                        position: {
                            left: 0,
                            top: focus.height / 2
                        },
                        radius: focus.width * 1.2,
                        nodeRef: createRef()
                    }] : []}
                    rippleColor={rippleColor}
                />
            )}
            decorationPlacement='middle'
            className={`PixelyUI PixelyTextField${focus ? ` PixelyTextField--Focus` : ''}`}
            onClick={() => inputRef.current?.focus()}
        >
            {startSlot}
            <input
                name={name}
                required={required}
                onChange={handleChange}
                placeholder={placeholder}
                className='PixelyUI PixelyTextField-Input'
                ref={inputRef}
                type={type}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...inputProps}
            />
            {endSlot}
        </Decorator>
    )
}

export default TextField
