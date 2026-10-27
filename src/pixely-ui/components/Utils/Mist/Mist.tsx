import '../../../global.css'
import { type ComponentPropsWithoutRef } from 'react'
// import styles from './Mist.module.css'

export interface MistProps extends ComponentPropsWithoutRef<'div'> {
    children: React.ReactNode,
    mistSize: number,
}

const Mist: React.FC<MistProps> = ({
    children,
    mistSize = 32,
    ...divAttributes

}: MistProps) => {
    return (
        <div {...divAttributes} style={{
            overflowY: 'auto',
            maskImage: `linear-gradient(to bottom, transparent, black ${mistSize}px, black calc(100% - ${mistSize}px), transparent)`,
            maskSize: `100% 100%`,
            maskPosition: '0 0',
            maskRepeat: 'no-repeat',
            ...divAttributes.style
        }}>
            {children}
        </div>
    )
}

export default Mist