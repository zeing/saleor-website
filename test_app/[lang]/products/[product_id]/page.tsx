'use client'
import Image from 'next/image'
import { cacheExchange, createClient, fetchExchange, ssrExchange, useQuery } from 'urql'
import { API_URL, DEFAULT_CHANNEL } from '@/constants'
import {
  CheckoutError,
  FetchProductsDocument,
  FetchProductsQuery,
  FetchProductsQueryVariables,
  ProductDetailsFragment,
  useCreateCheckoutMutation,
  useProductByIdQuery,
} from '@/generated/graphql'
import { getSelectedVariantID } from '@/utils/product'
import { contextToRegionQuery } from '@/utils/regions'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import clsx from 'clsx'
import { useUser } from '@/utils/hooks/useUser'
import VariantSelector from '@/components/VariantSelector'

const ssrCache = ssrExchange({ isClient: false })

export const apiClient = createClient({
  url: API_URL,
  exchanges: [cacheExchange, ssrCache, fetchExchange],
})

export async function generateStaticParams() {
  const { data } = await apiClient
    .query<FetchProductsQuery>(FetchProductsDocument, {
      channel: DEFAULT_CHANNEL,
      first: 9,
    } as FetchProductsQueryVariables)
    .toPromise()

  return (
    data?.products?.edges.map((edge) => ({
      params: { product_id: edge.node.id },
    })) ?? []
  )
}

const ProductPage = ({ params }: any) => {
  let id = params.product_id
  id = decodeURIComponent(id)

  const searchParams = useSearchParams()
  const [loadingAddToCheckout, setLoadingAddToCheckout] = useState(false)
  const [addToCartError, setAddToCartError] = useState('')
  //const { checkoutToken, setCheckoutToken, checkout } = useCheckout()
  let checkout: any = null
  const [{ fetching, data: resultCreateCheckout, error }, createCheckout] = useCreateCheckoutMutation()
  const { user } = useUser()

  const [{ data }] = useProductByIdQuery({
    variables: { id, ...contextToRegionQuery(params) },
  })

  if (!data?.product?.id) {
    return null
  }
  const firstImage = data?.product?.media?.[0]

  const selectedVariantID = getSelectedVariantID(data?.product as ProductDetailsFragment, searchParams)

  const selectedVariant = data?.product?.variants?.find((v) => v?.id === selectedVariantID) || undefined

  const onAddToCart = async () => {
    // Clear previous error messages
    setAddToCartError('')
    // Block add to checkout button
    setLoadingAddToCheckout(true)
    const errors: CheckoutError[] = []
    if (!selectedVariantID) {
      return
    }
    if (checkout) {
      //// If checkout is already existing, add products
      //const { data: addToCartData } = await addProductToCheckout({
      //  variables: {
      //    checkoutToken,
      //    variantId: selectedVariantID,
      //    locale: query.locale,
      //  },
      //})
      //addToCartData?.checkoutLinesAdd?.errors.forEach((e) => {
      //  if (e) {
      //    errors.push(e)
      //  }
      //})
    } else {
      // Theres no checkout, we have to create one
      const { data: createCheckoutData } = await createCheckout({
        email: user?.email,
        channel: DEFAULT_CHANNEL,
        lines: [
          {
            quantity: 1,
            variantId: selectedVariantID,
          },
        ],
      })
      console.log('createCheckoutData', createCheckoutData)
      createCheckoutData?.checkoutCreate?.errors.forEach((e) => {
        if (e) {
          errors.push(e)
        }
      })
      //if (createCheckoutData?.checkoutCreate?.checkout?.token) {
      //  setCheckoutToken(createCheckoutData?.checkoutCreate?.checkout?.token)
      //}
    }
    // Enable button
    setLoadingAddToCheckout(false)
    if (errors.length === 0) {
      // Product successfully added
      return
    }
    // Display error message
    const errorMessages = errors.map((e) => e.message || '') || []
    setAddToCartError(errorMessages.join('\n'))
  }

  const isAddToCartButtonDisabled = !selectedVariant || selectedVariant?.quantityAvailable === 0 || loadingAddToCheckout

  //const description =product'description')

  //const price = data.product.pricing?.priceRange?.start?.gross
  //const shouldDisplayPrice = data.product.variants?.length === 1 && price

  return (
    <div>
      <h2>{data?.product?.name}</h2>
      {firstImage && <Image alt={firstImage?.alt} src={firstImage?.url} width={256} height={256} />}
      <VariantSelector product={data.product} selectedVariantID={selectedVariantID} />
      <button
        onClick={onAddToCart}
        type="submit"
        disabled={isAddToCartButtonDisabled}
        className={clsx(
          'disabled:bg-disabled flex w-full items-center justify-center border-2 border-transparent bg-red-100 px-8 py-3 text-base text-black  focus:outline-none',
          !isAddToCartButtonDisabled && 'hover:border-red-200 hover:text-red-200'
        )}
        data-testid="addToCartButton"
      >
        add to card
        {/*{loadingAddToCheckout ? t.formatMessage(messages.adding) : t.formatMessage(messages.addToCart)}*/}
      </button>
    </div>
  )
}

export default ProductPage
