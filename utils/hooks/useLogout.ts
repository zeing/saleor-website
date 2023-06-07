import { useRouter } from 'next/router'

import { useCheckout } from '../providers/CheckoutProvider'
import { useSaleorAuthContext } from '@saleor/auth-sdk/react'

export const useLogout = () => {
  const { signOut } = useSaleorAuthContext()
  const { resetCheckoutId } = useCheckout()
  const router = useRouter()

  const onLogout = async () => {
    signOut()
    resetCheckoutId()
    void router.push('/')
  }

  return onLogout
}

export default useLogout
