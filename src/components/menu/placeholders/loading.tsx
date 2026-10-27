import { motion } from "motion/react";
import { CircularProgress } from "../../../pixely-ui";
import type { RefObject } from "react";

export const MenuPlaceholderLoading: React.FC<{ ref?: RefObject<HTMLDivElement> }> = ({ ref }) => (
    <motion.div
        ref={ref}
        key='loading'
        style={{ margin: 'auto' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .1, ease: 'linear' }}
    >
        <CircularProgress color='white' size={24} />
    </motion.div>
)
