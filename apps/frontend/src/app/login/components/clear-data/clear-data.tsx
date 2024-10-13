'use client';

import { FC, useCallback, useEffect } from 'react';

const ClearData: FC = () => {
  const clearData = useCallback(async () => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    clearData();
  }, [clearData]);

  return <></>;
};

export default ClearData;
