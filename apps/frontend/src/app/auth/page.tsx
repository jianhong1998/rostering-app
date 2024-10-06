'use client';

import { useSearchParams } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const Page: FC = () => {
  const query = useSearchParams();

  const id = useMemo(() => {
    return query.get('id');
  }, [query]);

  const fetchData = useCallback(async () => {
    const res = await axios.get<{ hashedSecret: string }>('/auth/api', {
      params: { id },
    });

    const data = res.data.hashedSecret;
    return data;
  }, [id]);

  useEffect(() => {
    fetchData().then((data) => {
      localStorage.setItem('secret', data);
      toast.success('Login successfully');
    });
  }, [fetchData]);

  if (!id) return <h1>No Id</h1>;
  return <h1>Login Successfully</h1>;
};

export default Page;
