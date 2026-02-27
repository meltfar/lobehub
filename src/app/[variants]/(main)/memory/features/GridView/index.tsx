import { type DivProps } from '@lobehub/ui';
import { Grid } from '@lobehub/ui';
import { type ReactNode } from 'react';
import { memo } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import Loading from '@/app/[variants]/(main)/memory/features/Loading';

import { useScrollParent } from '../TimeLineView/useScrollParent';

interface GridViewProps<T> {
  /**
   * Default column count (rows in Grid component)
   * Will be responsive based on window width
   */
  defaultColumnCount?: number;
  /**
   * Whether there are more items to load
   */
  hasMore?: boolean;
  /**
   * Whether data is currently loading
   */
  isLoading?: boolean;
  items: T[];
  /**
   * Max item width in pixels
   */
  maxItemWidth?: number;
  /**
   * Callback when end is reached
   */
  onLoadMore?: () => void;
  renderItem: (item: T, actions: ItemActions<T>) => ReactNode;
}

interface ItemActions<T> {
  onClick?: (item: T) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

interface GridListProps extends DivProps {
  ref?: React.RefObject<HTMLDivElement | null>;
}

interface GridContextType {
  defaultColumnCount?: number;
  maxItemWidth?: number;
}

const GridListWithContext = ({
  ref,
  ...props
}: GridListProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const context = (props as any).context as GridContextType | undefined;
  return (
    <Grid
      gap={8}
      maxItemWidth={context?.maxItemWidth ?? 240}
      ref={ref}
      rows={context?.defaultColumnCount ?? 3}
      {...props}
    />
  );
};

const GridFooterWithContext = () => {
  // Access context from Virtuoso - this is passed internally
  const context = ({} as any).context as
    | { defaultColumnCount?: number; isLoading?: boolean }
    | undefined;
  if (!context?.isLoading) return null;
  return <Loading rows={context.defaultColumnCount ?? 3} viewMode={'grid'} />;
};

function GridViewInner<T extends { id: string }>({
  items,
  defaultColumnCount = 3,
  maxItemWidth = 240,
  hasMore,
  isLoading,
  onLoadMore,
  renderItem,
}: GridViewProps<T>) {
  const scrollParent = useScrollParent();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <VirtuosoGrid
      context={{ defaultColumnCount, isLoading, maxItemWidth }}
      customScrollParent={scrollParent}
      data={items}
      endReached={hasMore && onLoadMore ? onLoadMore : undefined}
      increaseViewportBy={typeof window !== 'undefined' ? window.innerHeight : 0}
      overscan={48}
      style={{ minHeight: '100%' }}
      components={{
        Footer: isLoading ? GridFooterWithContext : undefined,
        List: GridListWithContext as any,
      }}
      itemContent={(index, item) => {
        if (!item || !item.id) {
          return null;
        }

        const actions: ItemActions<T> = {
          onClick: undefined,
          onDelete: undefined,
          onEdit: undefined,
        };

        return renderItem(item, actions);
      }}
    />
  );
}

export const GridView = memo(GridViewInner) as typeof GridViewInner;
