import { ZxcvbnFactory, type ZxcvbnResult } from "@zxcvbn-ts/core"
import { useEffect, useRef, useState, type MouseEventHandler } from "react"
import { RippleWrapper } from "../../pixely-ui"
import { AnchoredPopover } from "../../pixely-ui/components/DataDisplay/Popover"

import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnZhPackagr from '@zxcvbn-ts/language-zh'

export const PassphraseStrengthIndicator: React.FC<{
    passphrase: string,
    showSuggestions?: boolean
    onClick?: MouseEventHandler<HTMLDivElement>
}> = ({
    passphrase,
    showSuggestions,
    onClick
}) => {
    const zxcvbnRef = useRef<ZxcvbnFactory>(
        new ZxcvbnFactory({
            translations: zxcvbnZhPackagr.translations,
            graphs: zxcvbnCommonPackage.adjacencyGraphs,
            dictionary: {
                ...zxcvbnCommonPackage.dictionary,
                ...zxcvbnZhPackagr.dictionary,
            }
        })
    )

    const [zxcvbnResult, setZxcvbnResult] = useState<ZxcvbnResult>(zxcvbnRef.current.check(passphrase))

    useEffect(() => setZxcvbnResult(zxcvbnRef.current.check(passphrase)), [passphrase])

    return (
        <AnchoredPopover
            placement='top_end'
            offset={8}
            in={showSuggestions}
            bubbleColor='#333'
            onClick={ev => ev.stopPropagation()}
            content={
                <div style={{ fontSize: '13px' }}>
                    <p>密码强度：{['弱弱', '弱', '中', '强', '强强'][zxcvbnResult.score]}</p>
                    <p style={{ fontWeight: '700' }}>{zxcvbnResult.feedback.warning}</p>
                    {zxcvbnResult.feedback.suggestions.map(entry => <p style={{ opacity: '.67' }}>·{entry}</p>)}
                </div>
            }
        >
            {ref =>
                <RippleWrapper
                    ref={node => { ref.current = node }}
                    style={{ height: '100%' }}
                    onClick={onClick}
                >
                    <div className='register-panel__form__fields__indicator'>
                        {[0, 1, 2, 3, 4].map(i =>
                            <div
                                key={i}
                                style={zxcvbnResult.score >= i
                                    ? { backgroundColor: 'white', transform: 'none' }
                                    : undefined
                                }
                            />
                        )}
                    </div>
                </RippleWrapper>
            }
        </AnchoredPopover>
    )
}
