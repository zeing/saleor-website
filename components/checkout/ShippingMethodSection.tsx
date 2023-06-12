import { RadioGroup } from '@headlessui/react'
import React, { useState } from 'react'

import { Button } from '../Button'

import { ShippingMethodDisplay } from './ShippingMethodDisplay'
import { ShippingMethodOption } from './ShippingMethodOption'
import { CheckoutDetailsFragment, ShippingMethod, useCheckoutShippingMethodUpdateMutation } from '@/generated/graphql'
import { useRouter } from 'next/router'
import { routerToRegionQuery } from '@/utils/regions'
import { notNullable } from '@/utils/text'

export interface ShippingMethodSectionProps {
  checkout: CheckoutDetailsFragment
  active: boolean
}

export function ShippingMethodSection({ checkout, active }: ShippingMethodSectionProps) {
  const router = useRouter()
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(checkout.shippingMethod)
  const [editing, setEditing] = useState(!checkout.shippingMethod)

  const [_, checkoutShippingMethodUpdate] = useCheckoutShippingMethodUpdateMutation()

  const handleChange = async (method: ShippingMethod) => {
    const { data } = await checkoutShippingMethodUpdate({
      id: checkout.id,
      shippingMethodId: method.id,
      ...routerToRegionQuery(router),
    })
    if (data?.checkoutShippingMethodUpdate?.errors.length) {
      // todo: handle errors
      console.error(data?.checkoutShippingMethodUpdate?.errors)
      return
    }
    setSelectedDeliveryMethod(method)
    setEditing(false)
  }

  const availableShippingMethods = checkout.availableShippingMethods.filter(notNullable) || []

  return (
    <>
      <div className="mb-4 mt-4">
        <h2 className={active ? 'checkout-section-header-active' : 'checkout-section-header-disabled'}>
          Shipping Method
        </h2>
      </div>
      {active &&
        (editing ? (
          <RadioGroup value={selectedDeliveryMethod} onChange={handleChange} className="py-8">
            <div className="mt-4 grid grid-cols-2 gap-2">
              {availableShippingMethods.map((method) => {
                // todo: Investigate why filter did not excluded non existing methods
                if (!method) {
                  return null
                }
                return <ShippingMethodOption method={method} key={method.id} />
              })}
            </div>
          </RadioGroup>
        ) : (
          <section className="mb-4 flex items-center justify-between">
            {!!checkout.shippingMethod && <ShippingMethodDisplay method={checkout.shippingMethod} />}
            <div className="flex items-center justify-between">
              <Button onClick={() => setEditing(true)}>Change</Button>
            </div>
          </section>
        ))}
    </>
  )
}

export default ShippingMethodSection
