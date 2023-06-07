import { LanguageCodeEnum, PriceFragment } from '@/generated/graphql'
import { GetStaticPropsContext } from 'next'
import { NextRouter } from 'next/router'
import { formatAsMoney } from './text'

export const LOCALES = [
  {
    slug: 'en',
    code: 'EN' as LanguageCodeEnum,
    name: 'American English',
  },
  { slug: 'th', code: 'TH' as LanguageCodeEnum, name: 'ไทย' },
]
export const DEFAULT_LOCALE = 'en'

export interface Channel {
  slug: string
  name: string
  currencyCode: string
}

export const DEFAULT_CHANNEL: Channel = {
  slug: 'default-channel',
  name: 'United States Dollar',
  currencyCode: 'USD',
}

export const CHANNELS: Channel[] = [DEFAULT_CHANNEL]

export interface RegionCombination {
  channelSlug: string
  localeSlug: string
}

export interface Path<T> {
  params: T
}

export const localeToEnum = (localeSlug: string): LanguageCodeEnum => {
  const chosenLocale = LOCALES.find(({ slug }) => slug === localeSlug)?.code
  if (chosenLocale) {
    return chosenLocale
  }
  return LOCALES.find(({ slug }) => slug === DEFAULT_LOCALE)?.code || 'EN'
}

export const contextToRegionQuery = (context: GetStaticPropsContext) => ({
  locale: localeToEnum(context.locale?.toString() || DEFAULT_LOCALE),
})

export const routerToRegionQuery = (router: NextRouter) => ({
  locale: localeToEnum(router?.locale?.toString() || DEFAULT_LOCALE),
})

export const languageCodeToLocale = (locale: string) => {
  // Converts locale from EN_US to en-US
  const splitted = locale.split('_')
  splitted[0] = splitted[0].toLowerCase()
  return splitted.join('-')
}

export const formatPrice = (price?: PriceFragment, locale?: string) =>
  formatAsMoney(price?.amount || 0, price?.currency || 'thb', locale || DEFAULT_LOCALE)
