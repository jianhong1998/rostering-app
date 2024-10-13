import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Rostering App',
  description: 'Rostering App',
};

const theme = createTheme({
  defaultRadius: 'lg',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="light">
      <body>
        <MantineProvider theme={theme}>
          <Toaster richColors closeButton position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
