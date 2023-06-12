import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'

import { useCheckout } from '@/utils/providers/CheckoutProvider'
import { Spinner } from '@/components/Spinner'
import { useCheckoutCompleteMutation, useTransactionProcessMutation } from '@/generated/graphql'

function CheckoutPage() {
  const router = useRouter()
  const { resetCheckoutId } = useCheckout()
  const { query } = router
  const [, transactionProcess] = useTransactionProcessMutation()
  const [, checkoutComplete] = useCheckoutCompleteMutation()

  useEffect(() => {
    const processPayment = async () => {

      // todo: handle error from 2c2p
      if (query.transaction_id && query.invoice_no && query.checkout_id) {

        const { data, error } = await transactionProcess({
          id: query.transaction_id?.toString(),
          data: {
            invoiceNo: query.invoice_no,
          },
        })

        if (error || data?.transactionProcess?.errors) {
          console.error('error transactionProcess', error, data?.transactionProcess?.errors)
          return
        }
        const { data: dataCheckout, error: errorCheckout } = await checkoutComplete({
          checkoutId: query.checkout_id?.toString(),
        })

        if (errorCheckout || dataCheckout?.checkoutComplete?.errors) {
          console.error('error checkoutComplete', error, dataCheckout?.checkoutComplete?.errors)
          return
        }

        console.log('order', dataCheckout)
        void resetCheckoutId()
        void router.push(`/order/` + dataCheckout?.checkoutComplete?.order?.id)
      }
    }
    processPayment()
  }, [query])

  return (
    <>
      <Spinner />
    </>
  )
}

export default CheckoutPage
