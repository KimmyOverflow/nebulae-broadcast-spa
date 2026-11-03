import { createRef, useEffect, useRef, useState } from "react"
import { Decorator } from "../../Utils/Decorator"
import { RipplePool } from "../../Utils/Ripple"

export interface TextFieldProps {
    name?: string,
    required?: boolean,
    type?: React.HTMLInputTypeAttribute,
    placeholder?: string
    defaultValue?: string
    rippleColor?: string
    onChange?: (value: string) => void
    startSlot?: React.ReactNode
    endSlot?: React.ReactNode
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
    onChange,
}: TextFieldProps) => {
    useEffect(() => {
        if (defaultValue) {
            inputRef.current?.setAttribute('value', defaultValue)
        }
    }, [])
    const inputRef = useRef<HTMLInputElement>(null)
    const decoratorRef = useRef<HTMLDivElement>(null)
    const [focus, setFocus] = useState<DOMRect | false>(false)
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        onChange?.(ev.target.value)
    }

    return (
        <Decorator<'div'>
            as='div'
            ref={decoratorRef}
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
                onFocus={() => setFocus(decoratorRef.current!.getBoundingClientRect())}
                onBlur={() => setFocus(false)}
            />
            {endSlot}
        </Decorator>
    )
}

export default TextField
