import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

//import { usePaths } from '@/lib/paths'
//import { translate } from '@/lib/translations'

import { ProductDetailsFragment } from '@/generated/graphql'

export interface VariantSelectorProps {
  product: ProductDetailsFragment
  selectedVariantID?: string
}

export function VariantSelector({ product, selectedVariantID }: VariantSelectorProps) {
  const router = useRouter()
  const { query, pathname, asPath } = router
  const { variants } = product
 
  // Skip displaying selector when theres less than 2 variants
  if (!variants || variants.length === 1) {
    return null
  }

  const onChange = (value: string) => {
    //setSelectedVariant(value)
    void router.replace({ pathname: pathname, query: { ...query, variant: value } }, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  return (
    <div className="w-full">
      <RadioGroup value={selectedVariantID} defaultValue={selectedVariantID} onChange={onChange}>
        <div className="space-y-4">
          {variants.map((variant) => (
            <RadioGroup.Option
              key={variant.id}
              value={variant.id}
              className={({ checked }) => clsx('w-full border border-black', checked && 'bg-blue-300', !checked && '')}
            >
              {({ checked }) => (
                <div className={clsx('relative h-full w-full cursor-pointer object-contain')}>
                  <RadioGroup.Label as="div" className="w-full justify-between p-4">
                    <div className="text-md flex w-full flex-row gap-2 font-semibold">
                      <div className="grow" data-testid={`variantOf${variant.name}`}>
                        {variant.name}
                      </div>
                      <div>{variant.pricing?.price?.gross.amount}</div>
                    </div>
                  </RadioGroup.Label>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export default VariantSelector
