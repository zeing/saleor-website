import React from 'react'

import CheckoutProductList from './CheckoutProductList'
import { notNullable } from '@/utils/text'
import { CheckoutDetailsFragment } from '@/generated/graphql'
import { CartSummary } from './CartSummary'

interface CheckoutSidebarProps {
  checkout: CheckoutDetailsFragment
}

export function CheckoutSidebar({ checkout }: CheckoutSidebarProps) {
  const lines = checkout.lines?.filter(notNullable) || []
  console.log('checkout', checkout)
  return (
    <section className="flex w-full max-w-md flex-col ">
      <h1 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 md:py-4 md:pl-0 md:pr-4">
        Order Summary
      </h1>

      <CheckoutProductList lines={lines} id={checkout.id} />
      <CartSummary checkout={checkout} />
    </section>
  )
}

export default CheckoutSidebar
