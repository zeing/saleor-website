import { GetStaticPaths, GetStaticProps } from 'next'
import { initUrqlClient, withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { cacheExchange, createClient, fetchExchange, ssrExchange, useQuery } from 'urql'
import { API_URL, DEFAULT_CHANNEL } from '@/constants'
import {
  CheckoutError,
  ProductByIdDocument,
  ProductByIdQuery,
  ProductByIdQueryVariables,
  ProductDetailsFragment,
  useCheckoutAddProductLineMutation,
  useCreateCheckoutMutation,
  useProductByIdQuery,
} from '@/generated/graphql'
import { contextToRegionQuery, routerToRegionQuery } from '@/utils/regions'
import VariantSelector from '@/components/VariantSelector'
import clsx from 'clsx'
import { getSelectedVariantID } from '@/utils/product'
import { useUser } from '@/utils/hooks/useUser'
import { useState } from 'react'
import { translate } from '@/utils/translations'
import { RichText } from '@/components/RichText'
import { AttributeDetails } from '@/components/AttributeDetails'
import { ProductGallery } from '@/components/ProductGallery'
import { useCheckout } from '@/utils/providers/CheckoutProvider'

const ssrCache = ssrExchange({ isClient: false })

export const apiClient = createClient({
  url: API_URL,
  exchanges: [cacheExchange, ssrCache, fetchExchange],
})

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps: GetStaticProps = async (context) => {
  // The following content of "getStaticProps" is needed to populate the cache,
  // so you can consume the data through the "useFetchProductQuery" hook without making an extra request.
  // Read more in urql documentation: https://formidable.com/open-source/urql/docs/advanced/server-side-rendering/#ssr-with-getstaticprops-or-getserversideprops
  const id = context.params?.id

  const client = initUrqlClient(
    {
      url: API_URL,
      exchanges: [cacheExchange, ssrCache, fetchExchange],
    },
    false
  )
  const data = await client
    ?.query<ProductByIdQuery>(ProductByIdDocument, {
      id,
      channel: DEFAULT_CHANNEL,
      ...contextToRegionQuery(context),
    } as ProductByIdQueryVariables)
    .toPromise()

  return {
    props: {
      product: data?.data?.product,
    },
    revalidate: 1,
  }
}

const ProductPage = ({ product }: { product: ProductDetailsFragment }) => {
  const router = useRouter()

  const [_, addProductToCheckout] = useCheckoutAddProductLineMutation()
  const [loadingAddToCheckout, setLoadingAddToCheckout] = useState(false)
  const [addToCartError, setAddToCartError] = useState('')
  const { checkoutId, setCheckoutId, checkout } = useCheckout()
  const [{ fetching, data: resultCreateCheckout, error }, createCheckout] = useCreateCheckoutMutation()
  const { user } = useUser()

  if (!product?.id) {
    return null
  }
  const firstImage = product?.media?.[0]

  const selectedVariantID = getSelectedVariantID(product as ProductDetailsFragment, router) ?? ''
  const selectedVariant = product?.variants?.find((v) => v?.id === selectedVariantID) || undefined

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
      // If checkout is already existing, add products
      const { data: addToCartData } = await addProductToCheckout({
        checkoutId,
        variantId: selectedVariantID,
        ...routerToRegionQuery(router),
      })
      addToCartData?.checkoutLinesAdd?.errors.forEach((e) => {
        if (e) {
          errors.push(e)
        }
      })
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
      if (createCheckoutData?.checkoutCreate?.checkout?.id) {
        setCheckoutId(createCheckoutData?.checkoutCreate?.checkout?.id)
      }
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

  const description = translate(product, 'description')
  const price = product.pricing?.priceRange?.start?.gross
  const shouldDisplayPrice = product.variants?.length === 1 && price

  return (
    <>
      <main
        className={clsx(
          'container grid max-h-full grid-cols-1 gap-[3rem] overflow-auto px-8 pt-8 md:grid-cols-3 md:overflow-hidden'
        )}
      >
        <div className="col-span-2">
          <ProductGallery product={product} selectedVariant={selectedVariant} />
        </div>
        <div className="mt-10 space-y-5 md:mt-0">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-800" data-testid="productName">
              {translate(product, 'name')}
            </h1>
            {shouldDisplayPrice && <h2 className="text-xl font-bold tracking-tight text-gray-800">{price.amount}</h2>}
            {!!product.category?.slug && (
              <p className="text-md mt-2 cursor-pointer font-medium text-gray-600">
                {translate(product.category, 'name')}
              </p>
            )}
          </div>

          <VariantSelector product={product} selectedVariantID={selectedVariantID} />

          <button
            onClick={onAddToCart}
            type="submit"
            disabled={isAddToCartButtonDisabled}
            className={clsx(
              'disabled:bg-disabled flex w-full items-center justify-center border-2 border-transparent bg-red-500 px-8 py-3 text-base text-black  focus:outline-none',
              !isAddToCartButtonDisabled && 'hover:bg-red-300 hover:text-black'
            )}
            data-testid="addToCartButton"
          >
            ADD TO CART
          </button>

          {!selectedVariant && <p className="text-base text-yellow-600">No variant select</p>}

          {selectedVariant?.quantityAvailable === 0 && (
            <p className="text-base text-yellow-600" data-testid="soldOut">
              no strock
            </p>
          )}

          {!!addToCartError && <p>{addToCartError}</p>}

          {description && (
            <div className="space-y-6">
              <RichText jsonStringData={description} />
            </div>
          )}

          <AttributeDetails product={product} selectedVariant={selectedVariant} />
        </div>
      </main>
    </>
  )
}

export default ProductPage
