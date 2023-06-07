import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import { Button } from '../Button'

import { AddressDisplay } from './AddressDisplay'
import { AddressForm, AddressFormData } from './AddressForm'
import { useUser } from '@/utils/hooks/useUser'
import { useRouter } from 'next/router'
import { routerToRegionQuery } from '@/utils/regions'
import { CheckoutDetailsFragment, CountryCode, useCheckoutShippingAddressUpdateMutation } from '@/generated/graphql'
import { notNullable } from '@/utils/text'
import SavedAddressSelectionList from './SavedAddressSelectionList'

export interface ShippingAddressSectionProps {
  active: boolean
  checkout: CheckoutDetailsFragment
}

export function ShippingAddressSection({ active, checkout }: ShippingAddressSectionProps) {
  const router = useRouter()
  const { authenticated } = useUser()
  const [editing, setEditing] = useState(!checkout.shippingAddress)
  const [_, shippingAddressUpdateMutation] = useCheckoutShippingAddressUpdateMutation()

  const { billingAddress } = checkout

  const onSameAsBilling = async () => {
    if (!billingAddress) {
      return
    }
    const { data } = await shippingAddressUpdateMutation({
      address: {
        firstName: billingAddress.firstName || '',
        lastName: billingAddress.lastName || '',
        phone: billingAddress.phone || '',
        country: (billingAddress.country.code as CountryCode) || 'TH',
        streetAddress1: billingAddress.streetAddress1 || '',
        city: billingAddress.city || '',
        postalCode: billingAddress.postalCode || '',
      },
      id: checkout.id,
      ...routerToRegionQuery(router),
    })
    if (data?.checkoutShippingAddressUpdate?.errors.length) {
      // todo: add error handling
      return
    }
    // Successfully updated the shipping address
    setEditing(false)
  }
  const updateMutation = async (formData: AddressFormData) => {
    const { data } = await shippingAddressUpdateMutation({
      address: {
        ...formData,
      },
      id: checkout.id,
      ...routerToRegionQuery(router),
    })
    setEditing(false)
    return data?.checkoutShippingAddressUpdate?.errors.filter(notNullable) || []
  }

  return (
    <>
      <div className="mb-4 mt-4">
        <h2 className={active ? 'checkout-section-header-active' : 'checkout-section-header-disabled'}>
          Shipping Address
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
            <div className="col-span-full pb-4">
              <button type="button" className="btn-checkout-section" onClick={onSameAsBilling}>
                Use Same Billing Address
              </button>
            </div>
            <AddressForm
              existingAddressData={checkout.shippingAddress || undefined}
              toggleEdit={() => setEditing(false)}
              updateAddressMutation={updateMutation}
            />
          </>
        ) : (
          <section className="mb-4 flex items-center justify-between">
            {!!checkout.shippingAddress && <AddressDisplay address={checkout.shippingAddress} />}
            <Button onClick={() => setEditing(true)}>Change</Button>
          </section>
        ))}
    </>
  )
}

export default ShippingAddressSection
