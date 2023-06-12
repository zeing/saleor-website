import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/Button'
import { routerToRegionQuery } from '@/utils/regions'
import { CheckoutDetailsFragment, useCheckoutEmailUpdateMutation } from '@/generated/graphql'
import { useRouter } from 'next/router'

export interface EmailSectionProps {
  checkout: CheckoutDetailsFragment
}

export function EmailSection({ checkout }: EmailSectionProps) {
  const [modifyEmail, setModifyEmail] = useState(!checkout?.email)
  const router = useRouter()
  const [_, checkoutEmailUpdate] = useCheckoutEmailUpdateMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: checkout?.email || '',
    },
  })
  const onEmailFormSubmit = handleSubmit(async (formData) => {
    const result = await checkoutEmailUpdate({
      email: formData.email,
      id: checkout?.id,
      ...routerToRegionQuery(router),
    })
    const mutationErrors = result.data?.checkoutEmailUpdate?.errors || []
    if (mutationErrors.length > 0) {
      mutationErrors.forEach((e) => setError('email', { message: e.message || '' }))
      return
    }
    setModifyEmail(false)
  })

  return (
    <>
      <div className="mb-4 mt-4">
        <h2 className="checkout-section-header-active">Contact Email</h2>
      </div>
      {!modifyEmail ? (
        <div className="flex items-center justify-between">
          <p className="text-base">{checkout?.email}</p>
          <Button onClick={() => setModifyEmail(true)}>Change</Button>
        </div>
      ) : (
        <form method="post" onSubmit={onEmailFormSubmit}>
          <div className="grid w-full grid-cols-12 gap-4">
            <div className="col-span-full">
              <input
                type="text"
                autoComplete="email"
                className="w-full rounded-lg border-gray-300 text-base shadow-sm"
                spellCheck={false}
                {...register('email', {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
              />
              <p>{errors.email?.message}</p>
            </div>
            <div className="col-span-full">
              <button type="submit" className="btn-checkout-section">
                Save
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  )
}

export default EmailSection
