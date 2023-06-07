import { NextMiddlewareResult } from 'next/dist/server/web/types'
import { NextRequest, NextResponse } from 'next/server'

//import { CHANNELS, DEFAULT_LOCALE, LOCALES } from '@/utils/regions'

const PUBLIC_FILE = /\.(.*)$/

export function LocaleRedirectionMiddleware({
  url,
  nextUrl,
  headers,
  cookies,
  geo,
}: NextRequest): NextMiddlewareResult | Promise<NextMiddlewareResult> {
  //// Check if there is any supported locale in the pathname
  //const pathname = nextUrl.pathname

  //const pathnameIsMissingLocale = LOCALES.every(
  //  (locale) => !pathname.startsWith(`/${locale.slug}`) && pathname !== `/${locale.slug}`
  //)

  //// Redirect if there is no locale
  //if (pathnameIsMissingLocale) {
  //  const locale = headers.get('accept-language')?.split(',')?.[0] || DEFAULT_LOCALE
  //  // e.g. incoming request is /products
  //  // The new URL is now /en-US/products
  //  return NextResponse.redirect(new URL(`/${locale}/${pathname}`, url))
  //}

  if (
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(nextUrl.pathname)
  ) {
    return
  }

  if (nextUrl.locale === 'default') {
    const locale = cookies.get('NEXT_LOCALE')?.value || 'en'
    return NextResponse.redirect(new URL(`/${locale}${nextUrl.pathname}${nextUrl.search}`, url))
  }

  return
}

//export const config = {
//  matcher: [
//    // Skip all internal paths (_next)
//    '/((?!_next).*)',
//    // Optional: only run on root (/) URL
//    // '/'
//  ],
//}

export default LocaleRedirectionMiddleware
