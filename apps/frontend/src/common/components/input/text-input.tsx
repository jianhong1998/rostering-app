import { TextInput, TextInputProps } from '@mantine/core';
import { FC } from 'react';

type TextInputFieldProps = TextInputProps & {
  label: string;
};

const TextInputField: FC<TextInputFieldProps> = ({ ...props }) => {
  return <TextInput type="text" radius={10} {...props} />;
};

export default TextInputField;
