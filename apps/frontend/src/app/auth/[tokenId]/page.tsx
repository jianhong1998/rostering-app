'use client';

import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import FullPageLoading from '@/common/components/loading/full-page-loading';
import { DataTypeValidationUtil } from '@/utils/data-type-validation.util';

import { login } from './action';

interface PageProps {
  params: {
    tokenId: string;
  };
}

const Page: FC<PageProps> = ({ params: { tokenId } }) => {
  const router = useRouter();

  const loginFn = useCallback(async () => {
    if (!DataTypeValidationUtil.isUuid(tokenId)) {
      toast.error('Invalid token Id');
      router.replace('/login');
      return;
    }

    try {
      const { hashedSecret } = await login(tokenId);

      localStorage.setItem('key', hashedSecret);

      router.replace(`/`);
      toast.success('Login successfully!');
    } catch {
      toast.error('This login link is expired or used before.');
      router.replace('/login');
    }
  }, [tokenId, router]);

  useEffect(() => {
    loginFn();
  }, [loginFn]);

  return (
    <>
      <FullPageLoading open shouldBlur />
    </>
  );
};

export default Page;
