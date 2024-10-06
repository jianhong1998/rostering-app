'use client';

import { FC } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => {};
}

const Error: FC<ErrorProps> = ({ error, reset }) => {
  return (
    <>
      <h1>{JSON.stringify(error)}</h1>
      <button onClick={() => reset()}>Reset</button>
    </>
  );
};

export default Error;
