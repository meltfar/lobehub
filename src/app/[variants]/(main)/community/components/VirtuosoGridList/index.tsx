import { type DivProps } from '@lobehub/ui';
import { Flexbox, Grid } from '@lobehub/ui';
import { memo } from 'react';
import { type VirtuosoGridProps } from 'react-virtuoso';
import { VirtuosoGrid } from 'react-virtuoso';

import { useScrollParent } from './useScrollParent';

interface ListContainerProps extends DivProps {
  ref?: React.RefObject<HTMLDivElement | null>;
}

const VirtuosoListContainer = ({
  ref,
  ...props
}: ListContainerProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <Flexbox gap={16} ref={ref} {...props} />
);

VirtuosoListContainer.displayName = 'VirtuosoListContainer';

interface GridContainerProps extends DivProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  rows?: number;
}

const VirtuosoGridContainer = ({
  ref,
  rows = 4,
  ...props
}: GridContainerProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <Grid gap={16} maxItemWidth={280} ref={ref} rows={rows} {...props} />
);

VirtuosoGridContainer.displayName = 'VirtuosoGridContainer';

// Wrapper component that reads rows from context
interface GridContextType {
  rows?: number;
}

const GridListWithContext = ({
  ref,
  ...props
}: DivProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  // Virtuoso passes context via the context prop to the components
  // We need to use a different approach - pass rows via context
  const context = (props as any).context as GridContextType | undefined;
  return <VirtuosoGridContainer ref={ref} rows={context?.rows} {...props} />;
};

export const VirtuosoList = memo<VirtuosoGridProps<any, any>>(({ data, ...rest }) => {
  const scrollParent = useScrollParent();
  const initialItemCount = data && data?.length >= 8 ? 8 : data?.length;
  return (
    <VirtuosoGrid
      customScrollParent={scrollParent}
      data={data}
      increaseViewportBy={typeof window !== 'undefined' ? window.innerHeight : 0}
      initialItemCount={initialItemCount}
      overscan={24}
      components={{
        List: VirtuosoListContainer as any,
      }}
      {...rest}
    />
  );
});

const VirtuosoGridList = memo<VirtuosoGridProps<any, any> & { rows?: number }>(
  ({ data, initialItemCount, rows = 4, ...rest }) => {
    const scrollParent = useScrollParent();
    const count = data && data?.length >= 8 ? 8 : data?.length;
    const maxInitialItemCount =
      data && data?.length && initialItemCount && initialItemCount > data?.length
        ? data?.length
        : initialItemCount;

    return (
      <VirtuosoGrid
        context={{ rows }}
        customScrollParent={scrollParent}
        data={data}
        increaseViewportBy={typeof window !== 'undefined' ? window.innerHeight : 0}
        initialItemCount={maxInitialItemCount || count}
        overscan={24}
        components={{
          List: GridListWithContext as any,
        }}
        {...rest}
      />
    );
  },
);

export default VirtuosoGridList;
