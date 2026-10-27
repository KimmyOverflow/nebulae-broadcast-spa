import '../../../global.css'
export interface SnackbarProps {
    message: string,
    action: React.ReactNode,
    style: React.CSSProperties,
}

const Snackbar: React.FC<SnackbarProps> = ({
    message,
    action,
    style
}: SnackbarProps) => {
    return (
        <div className='PixelyUI PixelySnackbar' style={style}>
            <p className='PixelyUI PixelySnackbar-Message'>{message}</p>
            <div className='PixelyUI PixelySnackbar-ActionContainer'>
                {action}
            </div>
        </div>
    )
}

export default Snackbar