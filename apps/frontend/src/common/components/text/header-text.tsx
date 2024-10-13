import { Title, TitleProps } from '@mantine/core';
import { FC, ReactNode } from 'react';

type HeaderTextProps = TitleProps & {
  children: ReactNode;
};

const HeaderText: FC<HeaderTextProps> = ({ children, ...props }) => {
  return <Title {...props}>{children}</Title>;
};

export default HeaderText;
