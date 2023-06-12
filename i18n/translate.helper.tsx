import { FormattedMessage, useIntl as intlHook } from 'react-intl'

/**
 * short-handed by using `translate` function instead of `FormattedMessage` component,
 * see: https://formatjs.io/docs/react-intl/components/#formattedmessage
 */
export const formatMessage = (id: string, values?: any) => {
  return <FormattedMessage id={id} values={values} />
}

export type MessageKey = keyof typeof message

export const message = {
  footer_about: 'footer_about',
  logout: 'logout',
}

export const useIntl = intlHook
