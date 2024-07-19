import React, { useEffect, useRef } from "react";

function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement | undefined> {
    const ref = useRef<HTMLDivElement>();
    /**Move the scrollbar position(scrollTop) to scroll track height/bottom(scrollheight) */
    useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [dep]);
    return ref;
}
export {useChatScroll}  