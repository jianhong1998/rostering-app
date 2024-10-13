import { Center, Container, Paper, rem } from '@mantine/core';
import { FC } from 'react';

import globalCssClasses from '@/app/globals.module.css';
import HeaderText from '@/common/components/text/header-text';

import ClearData from './components/clear-data/clear-data';
import LoginForm from './components/login-form/login-form';

const LoginPage: FC = () => {
  return (
    <>
      <Container className={globalCssClasses.responsiveContainer}>
        {/* Welcome message */}
        <Center mb={rem('1rem')} mt={rem('5rem')}>
          <HeaderText c="blue">Welcome to login Rostering App</HeaderText>
        </Center>
        {/* Login Panel */}
        <Paper shadow="lg" p={rem('2rem')} w={rem('100%')}>
          <LoginForm />
        </Paper>
      </Container>
      <ClearData />
    </>
  );
};

export default LoginPage;
