// Custom hook for infinite scroll functionality
import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  hasNextPage?: boolean;
  isLoading?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = (
  fetchNextPage: () => void,
  options: UseInfiniteScrollOptions = {}
) => {
  const {
    hasNextPage = true,
    isLoading = false,
    threshold = 1.0,
    rootMargin = "100px",
  } = options;

  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && hasNextPage && !isLoading && !isFetching) {
        setIsFetching(true);
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isLoading, isFetching]
  );

  useEffect(() => {
    const element = loadingRef.current;

    if (!element) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false);
    }
  }, [isLoading]);

  return { loadingRef, isFetching };
};
