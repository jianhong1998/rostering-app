import { Button, ButtonProps } from '@mantine/core';
import { FC } from 'react';

type PrimaryButtonProps = ButtonProps & {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

const PrimaryButton: FC<PrimaryButtonProps> = ({ label, ...buttonProps }) => {
  return (
    <Button radius={10} {...buttonProps}>
      {label}
    </Button>
  );
};

export default PrimaryButton;
