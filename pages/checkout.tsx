import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'

import { useCheckout } from '@/utils/providers/CheckoutProvider'
import { Spinner } from '@/components/Spinner'
import CheckoutSidebar from '@/components/checkout/sidebar/CheckoutSidebar'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import { CheckoutDetailsFragment, useCheckoutBillingAddressUpdateMutation } from '@/generated/graphql'

function CheckoutPage() {
  const router = useRouter()
  const { checkout, loading } = useCheckout()
  const [_, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation()

  useEffect(() => {
    // Redirect to cart if theres no checkout data
    if (!loading && (!checkout || !checkout.lines?.length)) {
      void router.push('/')
    }
  })

  const isCheckoutLoading = loading || typeof window === 'undefined'
  if (isCheckoutLoading) {
    return (
      <>
        <Spinner />
      </>
    )
  }

  if (!checkout || checkout.lines?.length === 0) {
    return null
  }

  return (
    <>
      <main className="flex w-full flex-col justify-between overflow-hidden md:mx-auto md:flex-row md:px-8">
        <div className="w-full md:w-2/3">
          <CheckoutForm />
        </div>
        <div className="w-full md:w-1/3">
          <CheckoutSidebar checkout={checkout} />
        </div>
      </main>
    </>
  )
}

export default CheckoutPage
