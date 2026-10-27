import './style.css'

import { motion } from 'motion/react'
import { useRef, useState, type RefObject } from 'react'
import { Button, TextField } from '../../../../../pixely-ui'
import { ModalContainer } from '../../../modal'
import { Popover } from '../../popover'

interface AliasRenamePopupProps {
    scrollTop?: number
    onApply: (newAlias: string) => Promise<void>
    onCancel: () => void
}

export const AliasRenamePopup: React.FC<AliasRenamePopupProps> = ({
    scrollTop = 0,
    onApply,
    onCancel
}) => {
    const [value, setValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    return (
        <ModalContainer onClickOutside={onCancel}>
            {ref => (
                <Popover ref={ref as RefObject<HTMLDivElement>} anchor={{ top: 290 - scrollTop, right: 248 }}>
                    <TextField placeholder='新别名' rippleColor='rgba(255, 255, 255, .08)' onChange={value => setValue(value)} />
                    <span style={{ cursor: isLoading || value.length === 0 ? 'not-allowed' : undefined, width: '100%' }}>
                        <Button
                            loading={isLoading}
                            color='#222222'
                            style={{
                                width: '100%',
                                opacity: isLoading || value.length === 0 ? .5 : 1,
                                pointerEvents: isLoading || value.length === 0 ? 'none' : undefined
                            }}
                            text='应用'
                            onClick={() => {
                                setIsLoading(true)
                                onApply(value).finally(() => setIsLoading(false))
                            }}
                        />
                    </span>
                </Popover>
            )}
        </ModalContainer>
    )
}