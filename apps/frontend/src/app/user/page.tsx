'use client';

import { FC, useCallback, useEffect } from 'react';
import { getUser } from './action';

const UserPage: FC = () => {
  const getData = useCallback(async () => {
    const key = localStorage.getItem('key');
    const data = await getUser(key ?? '');

    console.log(data);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return <h1>User Page</h1>;
};

export default UserPage;
