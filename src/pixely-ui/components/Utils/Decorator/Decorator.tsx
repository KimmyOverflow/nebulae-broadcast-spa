import '../../../global.css'
import type { ComponentPropsWithRef, ElementType } from "react"

export type DecoratorProps<T extends ElementType> = ComponentPropsWithRef<T> & {
    as?: T,
    children: React.ReactNode,
    decoration: React.ReactNode,
    decorationContainerStyle?: React.CSSProperties,
    /** 
     * Specify the stacking position of the decoration.
     * <br>
     * <br>
     * Setting this value to `middle` will make all children elements of the wrapper to be in a stacking context,
     * so the stack position of the decoration can be determined in between the outer element and the children element.
     */
    decorationPlacement?: 'before' | 'middle' | 'after',
}

// ~~FIXME: Autocompletion isn't working for ComponentPropsWithoutRef<T> props.~~
// JUST USE IT LIKE THIS: <Decorator<'div'> as="div">{children}</Decorator>

/** Wrap anything with it. Inherits all the props of the element type you choose. */
const Decorator = <T extends ElementType>({
    as,
    children,
    decoration,
    decorationPlacement = 'after',
    decorationContainerStyle,
    className,
    ref,
    ...elementProps
}: DecoratorProps<T>) => {
    let Element = as || 'div'
    return (
        <Element
            ref={ref}
            className={
                `PixelyUI PixelyDecorator-Wrapper
                ${decorationPlacement === 'middle' ? 'PixelyDecorator-Wrapper--StackingContext' : ''}
                ${className ? className : ''}`
            }
            {...elementProps}
        >
            {children}
            <div 
                className='PixelyUI PixelyDecorator-DecorationContainer'
                style={{zIndex: decorationPlacement === 'before' ? -1 : 0, ...decorationContainerStyle}}
            >
                {decoration}
            </div>
        </Element>
    )
}

export default Decorator