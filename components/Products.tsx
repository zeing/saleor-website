import Image from 'next/image'
import Link from 'next/link'
import { DEFAULT_CHANNEL } from '@/constants'
import { FetchProductsQueryVariables, useFetchProductsQuery } from '@/generated/graphql'
import { useRouter } from 'next/router'

export const Products = () => {
  const router = useRouter()
  const { locale } = router

  let variables: FetchProductsQueryVariables = { channel: DEFAULT_CHANNEL, first: 9 }
  const [{ data }] = useFetchProductsQuery({ variables })

  return (
    <section>
      <h2 className="text-lg font-bold">Products</h2>
      <ul className="grid-list">
        {data?.products?.edges.map((edge) => {
          const firstImage = edge.node.media?.[0]

          return (
            <li key={edge.node.id}>
              <Link href={{ pathname: `/products/[id]`, query: { id: edge.node.id } }} locale={locale}>
                <article className="card">
                  {firstImage && <Image width={256} height={256} alt={firstImage.alt} src={firstImage.url} />}
                  <span>{edge.node.name}</span>
                </article>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
