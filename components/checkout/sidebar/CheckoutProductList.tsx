import Image from 'next/legacy/image'
import React from 'react'

import { translate } from '@/utils/translations'
import { useRouter } from 'next/router'
import { CheckoutLineDetailsFragment, useRemoveProductFromCheckoutMutation } from '@/generated/graphql'
import { formatPrice, routerToRegionQuery } from '@/utils/regions'

export interface CheckoutProductListProps {
  lines: CheckoutLineDetailsFragment[]
  id: string
}

export default function CheckoutProductList({ lines, id }: CheckoutProductListProps) {
  const router = useRouter()
  const [_, removeProductFromCheckout] = useRemoveProductFromCheckoutMutation()
  return (
    <ul className="flex-auto divide-y divide-gray-200 overflow-y-auto px-4 md:pl-0 md:pr-4">
      {lines.map((line) => {
        if (!line) {
          return null
        }
        return (
          <li key={line.id} className="flex space-x-4 py-4">
            <div className="relative h-32 w-32 rounded-md border bg-white object-cover object-center">
              {line.variant.product?.thumbnail && (
                <Image
                  src={line.variant.product?.thumbnail?.url}
                  alt={line.variant.product?.thumbnail?.alt || ''}
                  layout="fill"
                />
              )}
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-1 text-sm font-medium">
                <h3 className="text-gray-900">{translate(line.variant.product, 'name')}</h3>
                <p className="text-gray-500">{translate(line.variant, 'name')}</p>
                <p className="text-gray-900">{formatPrice(line.totalPrice?.gross)}</p>
                <p className="text-gray-900">Quantity {line.quantity}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  onClick={() =>
                    removeProductFromCheckout({
                      id: id,
                      lineId: line.id,
                      ...routerToRegionQuery(router),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
