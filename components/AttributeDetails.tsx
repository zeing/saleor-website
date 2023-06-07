import { useIntl } from 'react-intl'

import { getProductAttributes } from '@/utils/product'
import { translate } from '@/utils/translations'
import { ProductDetailsFragment, ProductVariantDetailsFragment } from '@/generated/graphql'

export interface AttributeDetailsProps {
  product: ProductDetailsFragment
  selectedVariant?: ProductVariantDetailsFragment
}

export function AttributeDetails({ product, selectedVariant }: AttributeDetailsProps) {
  const t = useIntl()
  const attributes = getProductAttributes(product, selectedVariant)

  if (attributes.length === 0) {
    return null
  }

  return (
    <div>
      <p className="mt-2 text-lg font-medium text-gray-500">Attributes</p>
      <div>
        {attributes.map((attribute) => (
          <div key={attribute.attribute.id} className="grid grid-cols-2">
            <div>
              <p className="text-base">{translate(attribute.attribute, 'name')}</p>
            </div>
            <div>
              {attribute.values.length
                ? attribute.values.map((value, index) => {
                    if (!value) {
                      return null
                    }
                    return (
                      <div key={value.id}>
                        <p className="text-base">
                          {translate(value, 'name')}
                          {attribute.values.length !== index + 1 && <div>{' | '}</div>}
                        </p>
                      </div>
                    )
                  })
                : '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
