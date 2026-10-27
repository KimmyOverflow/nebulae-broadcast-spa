import { CircularProgress } from '../../pixely-ui'
import './skeleton.css'

export const RegisterSkeleton: React.FC = () => (
    <div className='register-panel-skeleton'>
        <CircularProgress color='white' />
    </div>
)