import { motion, AnimatePresence } from "motion/react"
import { useRef, useState } from "react"

export const Playground: React.FC = () => {
    const [stack, setStack] = useState<number[]>([])
    const counterRef = useRef<number>(0)
    const last = stack[stack.length - 1]
    let item
    switch (last) {
        case 0:
            item = <Item1 key='1' />
            break;
        case 1:
            item = <Item2 key='2' />
            break;
        case 2:
            item = <Item3 key='3' />
            break;
    }
    return (
        <>
            <button onClick={() => {
                console.log(counterRef.current)
                let counter = counterRef.current
                setStack(stack => [...stack, counter])
                counterRef.current++
            }}>Push item</button>
            <button onClick={() => {
                setStack(stack => stack.toSpliced(-1, 1))
            }}>Pop item</button>
            <AnimatePresence>
                {item}
            </AnimatePresence>
        </>
    )
}

const Item1 = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        Item1
    </motion.div>
)
const Item2 = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        Item2
    </motion.div>
)
const Item3 = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        Item3
    </motion.div>
)