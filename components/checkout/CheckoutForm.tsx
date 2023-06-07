import React from 'react'

import { useCheckout } from '@/utils/providers/CheckoutProvider'

import { CheckoutDetailsFragment } from '@/generated/graphql'
import { Button } from '../Button'
import EmailSection from './EmailSection'
import BillingAddressSection from './BillingAddressSection'
import ShippingAddressSection from './ShippingAddressSection'
import ShippingMethodSection from './ShippingMethodSection'

interface CollapsedSections {
  billingAddress: boolean
  shippingAddress: boolean
  shippingMethod: boolean
  payment: boolean
}

const sectionsManager = (checkout?: CheckoutDetailsFragment): CollapsedSections => {
  // Will hide sections which cannot be set yet during the checkout
  // Start with all the sections hidden
  const state: CollapsedSections = {
    billingAddress: true,
    shippingAddress: true,
    shippingMethod: true,
    payment: true,
  }
  if (!checkout || !checkout.email) {
    return state
  }
  state.billingAddress = false
  if (!checkout.billingAddress) {
    return state
  }
  state.shippingAddress = false
  if (checkout.isShippingRequired && !checkout.shippingAddress) {
    return state
  }
  state.shippingMethod = false
  if (checkout.isShippingRequired && !checkout.shippingMethod) {
    return state
  }
  state.payment = false
  return state
}

export function CheckoutForm() {
  const { checkout } = useCheckout()

  if (!checkout) {
    return null
  }

  const collapsedSections = sectionsManager(checkout)

  return (
    <section className="flex flex-auto flex-col space-y-4 overflow-y-auto px-4 pb-4 pt-4">
      <div className="checkout-section-container">
        <EmailSection checkout={checkout} />
      </div>
      <div className="checkout-section-container">
        <BillingAddressSection active={!collapsedSections.billingAddress} checkout={checkout} />
      </div>

      {checkout.isShippingRequired && (
        <div className="checkout-section-container">
          <ShippingAddressSection active={!collapsedSections.shippingAddress} checkout={checkout} />
        </div>
      )}
      {checkout.isShippingRequired && (
        <div className="checkout-section-container">
          <ShippingMethodSection active={!collapsedSections.shippingMethod} checkout={checkout} />
        </div>
      )}
      <div className="checkout-section-container">
        <Button>Pay</Button>
      </div>
    </section>
  )
}

export default CheckoutForm
