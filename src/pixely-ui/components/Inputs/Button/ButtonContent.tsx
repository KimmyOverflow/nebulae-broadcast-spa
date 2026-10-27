import { CircularProgress } from '../../Feedback/CircularProgress'
import '../../../global.css'
export interface ButtonContentProps {
    text?: string | null,
    startIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
    loading?: boolean,
}

const ButtonContent: React.FC<ButtonContentProps> = ({
    text,
    startIcon,
    endIcon,
    loading
}) => {
    return (
        <div className='PixelyUI PixelyButton-ContentContainer'>
            {(_ => {
                if(loading === true) return <div className='PixelyUI PixelyButton-Icon'>{<CircularProgress style={{margin: 'auto'}} size={16} color='inherit'/>}</div>
                if(startIcon) return <div className='PixelyUI PixelyButton-Icon'>{startIcon}</div>
            })()}
            {(_ => {
                if(text !== null) return <div className='PixelyUI PixelyButton-Text'>{text}</div>
            })()}
            {(_ => {
                if(endIcon) return <div className='PixelyUI PixelyButton-Icon'>{endIcon}</div>
            })()}
        </div>
    )
}

export default ButtonContent