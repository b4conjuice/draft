import type { Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastContainer } from 'react-toastify'

import { TRPCReactProvider } from '@/trpc/react'

import '@/styles/globals.css'
import { DEFAULT_TITLE } from '@/lib/defaults'

export const metadata = {
  manifest: '/manifest.json',
  description: 'Generated by create-t3-app',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/icon.png',
  },
  title: DEFAULT_TITLE,
}

export const viewport: Viewport = {
  themeColor: '#15232d',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body>
          <TRPCReactProvider>
            <div className='flex min-h-screen flex-col bg-cb-dark-blue text-cb-white'>
              <ToastContainer
                autoClose={2000}
                theme='dark'
                toastClassName='bg-cb-off-blue text-cb-white rounded-lg'
                pauseOnFocusLoss={false}
              />
              {children}
            </div>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
