'use client'
import { Provider } from 'urql'
import { API_URL } from '@/constants'
import { cacheExchange, fetchExchange, ssrExchange } from 'urql'
import { useUrqlClient } from '@saleor/auth-sdk/react/urql'
import { SaleorAuthProvider, useAuthChange, useSaleorAuthClient } from '@saleor/auth-sdk/react'
import { LoginForm } from '@/components/LoginForm'
import '@/public/styles/global.css'

const ssrCache = ssrExchange({ isClient: false })

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params,
}: {
  children: React.ReactNode
  params: any
}) {
  const useSaleorAuthClientProps = useSaleorAuthClient({
    saleorApiUrl: API_URL,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  })

  const { urqlClient, reset, refetch } = useUrqlClient({
    url: API_URL,
    fetch: useSaleorAuthClientProps.saleorAuthClient.fetchWithAuth,
    exchanges: [cacheExchange, fetchExchange],
  })

  useAuthChange({
    saleorApiUrl: API_URL,
    onSignedOut: () => reset(),
    onSignedIn: () => refetch(),
  })

  return (
    <html>
      <body suppressHydrationWarning={true} lang={params.lang}>
        <SaleorAuthProvider {...useSaleorAuthClientProps}>
          <Provider value={urqlClient}>
            <main className="container">
              <header>
                <h1>Saleor + Next = 🫶</h1>
                <span className="info">
                  Saleor instance URL:{' '}
                  <a target={'_blank'} href={process.env.NEXT_PUBLIC_SALEOR_INSTANCE_URI} rel="noreferrer">
                    {process.env.NEXT_PUBLIC_SALEOR_INSTANCE_URI}
                  </a>
                </span>
              </header>
              <LoginForm />
              {children}
            </main>
          </Provider>
        </SaleorAuthProvider>
      </body>
    </html>
  )
}
