import { createContext, useContext } from "react";
import type { StreamData } from "../../components/headbar/stream-selector";

export interface StreamManagerContextValue {
    avaliableStreams: StreamData[] | null,
    currentlyStreaming: string | null,
    play: (streamId: string) => void,
    stop: () => void,
    reload: () => void
}

export const StreamManagerContext = createContext<StreamManagerContextValue | null>(null)

export function useStreamManager() {
    const ctx = useContext(StreamManagerContext)
    if (ctx === null) {
        throw new Error('在 StreamManagerContext 外调用了 useStreamManager. 请检查组件依赖.')
    }
    return ctx
}
