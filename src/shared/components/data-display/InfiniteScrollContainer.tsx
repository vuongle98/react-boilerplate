import { ReactNode, useCallback, useEffect, useRef } from "react";

interface InfiniteScrollContainerProps<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onLoadMore: () => void;
  renderItem: (item: T, index: number) => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (error: unknown) => ReactNode;
  renderEmpty?: () => ReactNode;
  className?: string;
  loaderClassName?: string;
  loadingIndicator?: ReactNode;
  threshold?: number;
}

export const InfiniteScrollContainer = <T,>({
  items,
  hasMore,
  isLoading,
  isError,
  error,
  onLoadMore,
  renderItem,
  renderLoading,
  renderError,
  renderEmpty,
  className = "",
  loaderClassName = "flex justify-center p-4",
  loadingIndicator = <div>Loading...</div>,
  threshold = 100,
}: InfiniteScrollContainerProps<T>) => {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !isLoading && hasMore) {
        onLoadMore();
      }
    },
    [isLoading, hasMore, onLoadMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver(handleObserver, option);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, isLoading]);

  // Error state
  if (isError) {
    return renderError ? (
      renderError(error)
    ) : (
      <div className="text-center p-4 text-red-500">
        Error loading items. Please try again later.
      </div>
    );
  }

  // Empty state
  if (!isLoading && items.length === 0) {
    return renderEmpty ? (
      renderEmpty()
    ) : (
      <div className="text-center p-4 text-gray-500">No items found</div>
    );
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div
          key={`item-${index}`}
          ref={index === items.length - 1 ? lastItemRef : null}
        >
          {renderItem(item, index)}
        </div>
      ))}

      {/* Load more trigger */}
      <div ref={loadMoreRef} className={loaderClassName}>
        {isLoading && (renderLoading ? renderLoading() : loadingIndicator)}
      </div>

      {/* Add some space at the bottom when loading more */}
      {hasMore && !isLoading && <div style={{ height: threshold }} />}
    </div>
  );
};

// Add display name for better debugging
InfiniteScrollContainer.displayName = "InfiniteScrollContainer";

export default InfiniteScrollContainer;
