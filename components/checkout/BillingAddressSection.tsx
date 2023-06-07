import React, { useState } from 'react'

import { Button } from '@/components/Button'
import { AddressDisplay } from './AddressDisplay'
import { AddressForm, AddressFormData } from './AddressForm'
import SavedAddressSelectionList from './SavedAddressSelectionList'
import { notNullable } from '@/utils/text'
import { useUser } from '@/utils/hooks/useUser'
import { useRouter } from 'next/router'
import { routerToRegionQuery } from '@/utils/regions'
import { CheckoutDetailsFragment, useCheckoutBillingAddressUpdateMutation } from '@/generated/graphql'

export interface BillingAddressSection {
  active: boolean
  checkout: CheckoutDetailsFragment
}

export function BillingAddressSection({ active, checkout }: BillingAddressSection) {
  const { authenticated } = useUser()
  const [editing, setEditing] = useState(!checkout.billingAddress)
  const [_, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation()

  const router = useRouter()

  const updateMutation = async (formData: AddressFormData) => {
    const { data } = await checkoutBillingAddressUpdate({
      address: {
        ...formData,
      },
      id: checkout.id,
      ...routerToRegionQuery(router),
    })
    setEditing(false)
    return data?.checkoutBillingAddressUpdate?.errors.filter(notNullable) || []
  }

  return (
    <>
      <div className="mb-4 mt-4">
        <h2 className={active ? 'checkout-section-header-active' : 'checkout-section-header-disabled'}>
          Billing Address
        </h2>
      </div>
      {active &&
        (editing ? (
          <>
            {authenticated && (
              <SavedAddressSelectionList
                updateAddressMutation={(address: AddressFormData) => updateMutation(address)}
              />
            )}
            <AddressForm
              existingAddressData={checkout.billingAddress || undefined}
              toggleEdit={() => setEditing(false)}
              updateAddressMutation={updateMutation}
            />
          </>
        ) : (
          <section className="mb-4 flex items-center justify-between">
            {!!checkout.billingAddress && <AddressDisplay address={checkout.billingAddress} />}
            <Button onClick={() => setEditing(true)}>Change</Button>
          </section>
        ))}
    </>
  )
}

export default BillingAddressSection
