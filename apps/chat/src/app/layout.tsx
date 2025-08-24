'use client';
import React from 'react';
import { Providers } from "./providers";
import "./globals.css";
// @ts-ignore
import NoSSR from 'react-no-ssr';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" x-layout="root">
      <body>
        <NoSSR>
          <Providers>
            {children}
          </Providers>
        </NoSSR>
      </body>
    </html>
  );
}
