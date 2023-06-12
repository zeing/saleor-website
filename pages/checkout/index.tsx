import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'

import { useCheckout } from '@/utils/providers/CheckoutProvider'
import { Spinner } from '@/components/Spinner'
import CheckoutSidebar from '@/components/checkout/sidebar/CheckoutSidebar'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import {
  AddressInput,
  CheckoutDetailsFragment,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutShippingAddressUpdateMutation,
} from '@/generated/graphql'
import { routerToRegionQuery } from '@/utils/regions'

function CheckoutPage() {
  const router = useRouter()
  const { checkout, loading } = useCheckout()
  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation()
  const [, shippingAddressUpdateMutation] = useCheckoutShippingAddressUpdateMutation()

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

  const prepareCheckoutData = async () => {
    console.log('checkout', checkout)
    if (!checkout.billingAddress) {
      let address: AddressInput = {
        country: 'TH',
        firstName: 'Eing',
        lastName: 'Test',
        streetAddress1: 'ul. Tęczowa 7',
        postalCode: '10900',
        city: 'Wroclaw',
      }
      await checkoutBillingAddressUpdate({
        address,
        id: checkout.id,
        ...routerToRegionQuery(router),
      })
    }

    if (!checkout.shippingAddress) {
      let address: AddressInput = {
        country: 'TH',
        firstName: 'Eing',
        lastName: 'Test',
        streetAddress1: 'ul. Tęczowa 7',
        postalCode: '10900',
        city: 'BKK',
      }
      await shippingAddressUpdateMutation({
        address,
        id: checkout.id,
        ...routerToRegionQuery(router),
      })
    }

    void router.reload()
  }

  return (
    <>
      <main className="flex w-full flex-col justify-between overflow-hidden md:mx-auto md:flex-row md:px-8">
        <div className="w-full md:w-2/3">
          <button className="bg-red-500" onClick={prepareCheckoutData}>
            Prepare Data to Checkout
          </button>
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
