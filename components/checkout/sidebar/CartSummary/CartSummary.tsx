import { CheckoutDetailsFragment, useCheckoutAddPromoCodeMutation } from '@/generated/graphql'
import { formatPrice, routerToRegionQuery } from '@/utils/regions'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export interface PromoCodeFormData {
  promoCode: string
}

export interface CartSummaryProps {
  checkout: CheckoutDetailsFragment
}

export function CartSummary({ checkout }: CartSummaryProps) {
  const [editPromoCode] = useState(false)
  const router = useRouter()
  const [_, checkoutAddPromoCodeMutation] = useCheckoutAddPromoCodeMutation()
  const { subtotalPrice, shippingPrice, totalPrice, discount } = checkout
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<PromoCodeFormData>({})

  const onAddPromoCode = handleSubmitForm(async (formData: PromoCodeFormData) => {
    const { data: promoMutationData } = await checkoutAddPromoCodeMutation({
      promoCode: formData.promoCode,
      id: checkout.id,
      ...routerToRegionQuery(router),
    })
    const errors = promoMutationData?.checkoutAddPromoCode?.errors
    if (!!errors && errors.length > 0) {
      setErrorForm('promoCode', { message: errors[0].message || 'Error' })
    }
  })
  return (
    <section>
      <div className="rounded border bg-gray-50 p-8">
        {/*{(editPromoCode || !discount?.amount) && (
          <form method="post" className="pb-4" onSubmit={onAddPromoCode}>
            <label htmlFor="discount-code" className="block text-sm font-medium text-gray-700">
              Discount
            </label>
            <div className="mt-1 flex space-x-4">
              <input
                type="text"
                id="discount-code"
                className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                spellCheck={false}
                {...registerForm('promoCode', {
                  required: true,
                })}
              />
              <button
                type="submit"
                className="rounded-md bg-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-blue-300"
              >
                Apply
              </button>
            </div>
            {!!errorsForm.promoCode && <p className="pt-2 text-sm text-red-500">{errorsForm.promoCode?.message}</p>}
          </form>
        )}*/}
        <div className="flow-root">
          <dl className="text-sm">
            {!!discount?.amount && (
              <div className="flex items-center justify-between py-2">
                <dt className="text-gray-600">Discount</dt>
                <dd className="font-medium text-gray-900">{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex items-center justify-between py-2">
              <dt className="text-gray-600">Sub Total</dt>
              <dd className="font-medium text-gray-900">{formatPrice(subtotalPrice?.net)}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-gray-600">Shipping</dt>
              <dd className="font-medium text-gray-900">{formatPrice(shippingPrice?.gross)}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-gray-600">Tax</dt>
              <dd className="font-medium text-gray-900">{formatPrice(subtotalPrice?.tax)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-300 pt-4">
              <dt className="text-lg font-bold text-gray-900">Total</dt>
              <dd className="text-lg font-bold text-gray-900">{formatPrice(totalPrice?.gross)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
