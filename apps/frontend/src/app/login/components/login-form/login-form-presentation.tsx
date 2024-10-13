'use client';

import { Stack } from '@mantine/core';
import { Form, UseFormReturnType } from '@mantine/form';
import { FC } from 'react';

import PrimaryButton from '@/common/components/buttons/primary-button';
import TextInputField from '@/common/components/input/text-input';

import { ILoginFormData } from '../../types/login-form-data';

type LoginFormPresentationProps = {
  onSubmit: (formData: ILoginFormData) => void;
  form: UseFormReturnType<ILoginFormData>;
};

const LoginFormPresentation: FC<LoginFormPresentationProps> = ({
  onSubmit,
  form,
}) => {
  return (
    <Form onSubmit={onSubmit} form={form}>
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
  );
};

export default LoginFormPresentation;
