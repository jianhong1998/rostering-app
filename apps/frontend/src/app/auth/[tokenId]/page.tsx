import { FC } from 'react';
import { getToken } from './action';

interface PageProps {
  params: {
    tokenId: string;
  };
}

const Page: FC<PageProps> = async ({ params: { tokenId } }) => {
  const getTokenResponse = await getToken(tokenId);
  const data = await getTokenResponse.json();

  console.log({ data });

  return (
    <>
      <h1>Token</h1>
    </>
  );
};

export default Page;
