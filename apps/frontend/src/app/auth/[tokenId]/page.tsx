'use client';

import { FC, useEffect } from 'react';
import { getToken } from './action';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    tokenId: string;
  };
}

const Page: FC<PageProps> = ({ params: { tokenId } }) => {
  const router = useRouter();

  useEffect(() => {
    getToken(tokenId).then(() => {
      router.replace('/');
    });
  }, [tokenId]);

  return (
    <>
      <h1>Token</h1>
    </>
  );
};

export default Page;
