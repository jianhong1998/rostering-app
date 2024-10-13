'use client';

import { Stack } from '@mantine/core';
import { Form, useForm } from '@mantine/form';
import { FC } from 'react';
import { toast } from 'sonner';

import PrimaryButton from '@/common/components/buttons/primary-button';
import TextInputField from '@/common/components/input/text-input';

import { requestLogin } from '../../action';
import { ILoginFormData } from '../../types/login-form-data';

const LoginForm: FC = () => {
  const form = useForm<ILoginFormData>({
    mode: 'controlled',
    name: 'login-form',
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Invalid email address';
      },
    },
  });

  const submitForm = async (value: ILoginFormData) => {
    try {
      if (!value.email) return;

      await requestLogin(value.email);
      toast.success(
        'Email is sent. Please follow instruction in email to login.',
      );
    } catch (error) {
      console.log(error);
      toast.error('Oops! Something went wrong! Please try again!');
    }
  };

  return (
    <>
      <Form onSubmit={submitForm} form={form}>
        <Stack gap="md">
          <TextInputField
            label="Email Address"
            placeholder="example@gmail.com"
            value={form.values.email}
            {...form.getInputProps('email')}
          />
          <PrimaryButton label="Login" type="submit" />
        </Stack>
      </Form>
    </>
  );
};

export default LoginForm;
