import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import { CHECKOUT_ID } from '@/utils/const'
import { useLocalStorage } from '@/utils/hooks/useLocalStorage'
import { DEFAULT_LOCALE, localeToEnum, routerToRegionQuery } from '@/utils/regions'
import createSafeContext from '@/utils/hooks/useSafeContext'
import { CheckoutDetailsFragment, useCheckoutByIdQuery } from '@/generated/graphql'
import { CombinedError } from 'urql'

export interface CheckoutConsumerProps {
  checkoutId: string
  setCheckoutId: (id: string) => void
  resetCheckoutId: () => void
  checkout: CheckoutDetailsFragment | undefined | null
  checkoutError: CombinedError | undefined
  loading: boolean
}

export const [useCheckout, Provider] = createSafeContext<CheckoutConsumerProps>()

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const locale = router.locale?.toString() || DEFAULT_LOCALE // fix DEFAULT_LOCALE

  const [checkoutId, setCheckoutId] = useLocalStorage<string>(CHECKOUT_ID, '', { sync: true })

  const [{ data, fetching: loading, error: checkoutError }] = useCheckoutByIdQuery({
    variables: { id: checkoutId, ...routerToRegionQuery(router) },
    pause: typeof window === 'undefined',
  })
  console.log('checkoutId', checkoutId, 'isloading', loading)
  const resetCheckoutId = () => setCheckoutId('')

  const providerValues: CheckoutConsumerProps = {
    checkoutId,
    setCheckoutId,
    resetCheckoutId,
    checkout: data?.checkout,
    loading,
    checkoutError,
  }

  return <Provider value={providerValues}>{children}</Provider>
}
