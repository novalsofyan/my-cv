import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'
import React from 'react'

const Devtools = import.meta.env.DEV
  ? React.lazy(() => import('../components/Devtools').then((mod) => ({ default: mod.Devtools })))
  : () => null

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'MyCV - Buat CV Profesional dengan Cepat' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        {children}
        <Suspense fallback={null}>
          <Devtools />
        </Suspense>
        <Scripts />
        <Footer />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center grow">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
      <a href="/" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Kembali ke Home
      </a>
    </div>
  )
}
