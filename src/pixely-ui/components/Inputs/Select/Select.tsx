import { createPortal } from 'react-dom'
import '../../../global.css'
import SelectBox from './SelectBox'
import SelectMenu from './SelectMenu'
import PopoverTransitionProvider from '../../Utils/Popover/PopoverTransitionProvider'
import Popover from '../../Utils/Popover/Popover'
import { type MouseEventHandler, useRef, useState } from 'react'
import useOutsideClick from '../../../hooks/useOutsideClick'

export interface SelectProps {
    defaultValue?: string,
    placeholder?: string,
    options: {value: string, label: string}[]
    onSelectChange: (value: string) => void
    minWidth?: number,
    renderTarget?: Element | DocumentFragment
}

const Select: React.FC<SelectProps> = ({
    defaultValue,
    placeholder,
    options,
    onSelectChange,
    minWidth,
    renderTarget = document.documentElement
}) => {
    const [selected, setSelected] = useState<string | undefined>(defaultValue)
    const [focused, setFocused] = useState(false)
    const anchorPoint = useRef({top: 0, left: 0})
    const selectBoxWidth = useRef<number | undefined>(undefined)
    const selectBoxRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)

    useOutsideClick(() => {
        setFocused(false)
    }, [selectBoxRef, popoverRef])

    const handleSelectBoxMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
        const DOMRect = e.currentTarget.getBoundingClientRect()
        anchorPoint.current = {top: DOMRect.bottom, left: DOMRect.left}
        selectBoxWidth.current = DOMRect.width
        setFocused(true)
    }

    const handleSelectChange = (value: string) => {
        setSelected(value)
        setFocused(false)
        onSelectChange(value)
    }
    return (
        <>
            <SelectBox
                focusd={focused}
                ref={selectBoxRef}
                style={{minWidth}}
                placeholder={placeholder}
                selected={options.find(opt => opt.value === selected)?.label}
                onMouseDown={handleSelectBoxMouseDown}
            />
            {createPortal((
                <PopoverTransitionProvider in={focused} placement='bottom_start'>
                    <Popover ref={popoverRef} placement='bottom_start' anchorPoint={anchorPoint.current} offset={8}>
                        <SelectMenu selected={selected} options={options} onSelectChange={handleSelectChange} style={{minWidth: selectBoxWidth.current}}/>
                    </Popover>
                </PopoverTransitionProvider>
            ), renderTarget)}
        </>
    )
}

export default Select