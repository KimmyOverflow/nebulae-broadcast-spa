import { useCallback } from 'react';

type ReactRef<T> = React.RefCallback<T> | React.RefObject<T | null> | null;

function useMergeRefs<T>(...refs: (ReactRef<T> | undefined | null)[]): React.RefCallback<T> {
    return useCallback((element: T | null) => {
        refs.forEach((ref) => {
            if (!ref) return;
            if (typeof ref === 'function') {
                ref(element);
            } else {
                ref.current = element;
            }
        });
    }, refs);
}

export default useMergeRefs;