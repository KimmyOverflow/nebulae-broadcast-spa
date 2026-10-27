import { motion } from "motion/react";
import type { RefObject } from "react";

export const MenuPlaceholderEmpty: React.FC<{ ref?: RefObject<HTMLDivElement> }> = ({ ref }) => (
    <motion.span
        ref={ref}
        key='success_empty'
        style={{ margin: 'auto' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .1, ease: 'linear' }}
    >
        无数据
    </motion.span>
)
