import { LoadingOverlay } from '@mantine/core';
import { FC } from 'react';

type FullPageLoadingProps = {
  open: boolean;
  shouldBlur?: boolean;
  zIndex?: number;
};

const FullPageLoading: FC<FullPageLoadingProps> = ({
  open,
  shouldBlur,
  zIndex,
}) => {
  return (
    <LoadingOverlay
      visible={open}
      zIndex={zIndex}
      overlayProps={{ radius: 'sm', blur: shouldBlur ? 3 : 0 }}
    />
  );
};

export default FullPageLoading;
