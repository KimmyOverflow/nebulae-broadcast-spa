import { type ComponentPropsWithoutRef } from 'react'
import { RippleWrapper } from '../../Utils/Ripple'

export interface SelectMenuProps extends ComponentPropsWithoutRef<'div'> {
    selected?: string,
    options: {value: string, label: string}[]
    onSelectChange: (value: string) => void
}

const SelectMenu: React.FC<SelectMenuProps> = ({
    selected,
    options,
    onSelectChange,
    ...divProps
}) => {
    return (
        <div className='PixelySelectMenu' {...divProps}>
            {options.map((option, index) => (
                <RippleWrapper<'div'>
                    key={index}
                    as='div'
                    rippleColor='rgba(0, 0, 0, .16)'
                    onClick={() => onSelectChange(option.value)}
                    className='PixelySelectMenu-Item'
                    style={{backgroundColor: selected === option.value ? 'rgba(0, 0, 0, .08)' : undefined}}
                >
                    {option.label}
                </RippleWrapper>
            ))}
        </div>
    )
}

export default SelectMenu