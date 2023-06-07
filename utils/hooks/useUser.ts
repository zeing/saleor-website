import { Exact, useCurrentUserQuery } from '@/generated/graphql'
import { UseQueryArgs } from 'urql'

export const useUser = (
  options?:
    | Omit<
        UseQueryArgs<
          Exact<{
            [key: string]: never
          }>
        >,
        'query'
      >
    | undefined
) => {
  const [{ data, fetching }] = useCurrentUserQuery(options)

  const user = data?.user

  const authenticated = !!user?.id

  return { user, loading: fetching, authenticated }
}
