import { type CSSProperties, useState } from 'react'
import '../../../global.css'
import { CircularProgress } from '../../Feedback/CircularProgress'

export interface ToggleProps {
    checked?: boolean,
    onChange: (checked: boolean) => void,
    loading?: boolean,
    color: CSSProperties['color']
}

const Toggle: React.FC<ToggleProps> = ({
    checked,
    onChange,
    loading = false,
    color = '#0099BC'
}: ToggleProps) => {
    const [isChecked, setChecked] = useState<boolean>(checked ? true : false)
    const handleClick = () => {
        if(isChecked) {
            setChecked(false)
            onChange(false)
        } else {
            setChecked(true)
            onChange(true)
        }
    }
    return (
        <div className='PixelyUI PixelyToggle' onClick={handleClick} style={isChecked ? {backgroundColor: color} : undefined}>
            <div className={`PixelyUI PixelyToggle-Handle ${isChecked ? 'PixelyToggle-Handle--Checked' : ''}`}>
                {loading ? <CircularProgress size={16}/> : null}
            </div>
        </div>
    )
}

export default Toggle