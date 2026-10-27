import { motion } from "motion/react";
import { Button } from "../../../pixely-ui";
import IconRefresh from '../../../assets/icons/refresh.svg?react'
import type { RefObject } from "react";

export const MenuPlaceholderError: React.FC<{
    ref?: RefObject<HTMLDivElement>,
    onRetry: () => void
}> = ({ ref, onRetry }) => (
    <motion.div
        ref={ref}
        key='error'
        style={{ margin: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .1, ease: 'linear' }}
    >
        <Button variant='outlined' startIcon={<IconRefresh color='white' />} color='white' text='重试' onClick={onRetry} />
    </motion.div>
)
