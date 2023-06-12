import type { AppProps } from 'next/app'
import { Provider } from 'urql'
import { API_URL } from '@/constants'
import { cacheExchange, fetchExchange, ssrExchange } from 'urql'
import { useUrqlClient } from '@saleor/auth-sdk/react/urql'
import { SaleorAuthProvider, useAuthChange, useSaleorAuthClient } from '@saleor/auth-sdk/react'
import { IntlProvider } from 'react-intl'
import { ToastContainer,TypeOptions } from 'react-toastify'
import clsx from 'clsx'

import '@/public/styles/global.css'
import { Fragment } from 'react'
import { DEFAULT_LOCALE } from '@/utils/regions'
import { CheckoutProvider } from '@/utils/providers/CheckoutProvider'
import { Navbar } from '@/components/Navbar'
import messages from '@/i18n/messages'

const alertsContainerProps = {
  toastClassName: 'alert-container',
  bodyClassName: (data?: { type?: TypeOptions }) =>
    clsx('alert', {
      ['alert-error']: data?.type === 'error',
      ['alert-success']: data?.type === 'success',
    }),
  autoClose: 4000,
  hideProgressBar: true,
  closeButton: () => null,
  closeOnClick: false,
}

const ssrCache = ssrExchange({ isClient: false })

export default function App({ Component, pageProps, router }: AppProps) {
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

  const locale = router?.locale?.toString() || DEFAULT_LOCALE

  return (
    <SaleorAuthProvider {...useSaleorAuthClientProps}>
      <Provider value={urqlClient}>
        <IntlProvider
          locale={locale}
          defaultLocale={DEFAULT_LOCALE}
          textComponent={Fragment}
          messages={{ ...messages[locale] }}
        >
          <CheckoutProvider>
            <main className="container flex min-h-screen flex-col">
              <ToastContainer {...alertsContainerProps} />
              <Navbar />
              <Component {...pageProps} />
            </main>
          </CheckoutProvider>
        </IntlProvider>
      </Provider>
    </SaleorAuthProvider>
  )
}
