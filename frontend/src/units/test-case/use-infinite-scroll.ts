import { useState, useRef, useCallback, useMemo } from "react";
import {
  INITIAL_VISIBLE,
  LOAD_MORE_SIZE,
  SCROLL_THRESHOLD,
} from "./consts";

export function useInfiniteScroll<T>(items: T[]) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const total = items.length;
    if (visibleCount >= total) return;
    const { scrollTop, clientHeight, scrollHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_SIZE, total));
    }
  }, [items.length, visibleCount]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );
  const hasMore = visibleCount < items.length;

  return {
    visibleCount,
    setVisibleCount,
    scrollRef,
    handleScroll,
    visibleItems,
    hasMore,
    INITIAL_VISIBLE,
  };
}
