import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { useCheckout } from '@/utils/providers/CheckoutProvider'
import styles from './Navbar.module.css'
import NavIconButton from './NavIconButton'
import Stamp from './Stamp'
import UserMenu from './UserMenu'
import { useUser } from '@/utils/hooks/useUser'
import { CheckoutLineDetailsFragment } from '@/generated/graphql'
import { routerToRegionQuery } from '@/utils/regions'
import { API_URL, DEFAULT_CHANNEL } from '@/constants'

export function Navbar() {
  const router = useRouter()

  const [isBurgerOpen, setBurgerOpen] = useState(false)
  const { user, authenticated } = useUser()
  const { checkout } = useCheckout()
  const { locale } = useRouter()

  const checkoutParams = checkout
    ? new URLSearchParams({
        checkout: checkout.id,
        channel: DEFAULT_CHANNEL,
        saleorApiUrl: API_URL,
        ...routerToRegionQuery(router),
      })
    : new URLSearchParams()

  const externalCheckoutUrl = checkout ? `/checkout/?${checkoutParams.toString()}` : '#'

  useEffect(() => {
    // Close side menu after changing the page
    router.events.on('routeChangeStart', () => {
      if (isBurgerOpen) {
        setBurgerOpen(false)
      }
    })
  })

  const counter =
    checkout?.lines?.reduce(
      (amount: number, line?: CheckoutLineDetailsFragment | null) => (line ? amount + line.quantity : amount),
      0
    ) || 0

  return (
    <>
      <div className={clsx(styles.navbar)}>
        <div className={clsx(styles.inner)}>
          <div className=" flex flex-1">
            <span className="info">
              Saleor instance URL:{' '}
              <a target={'_blank'} href={process.env.NEXT_PUBLIC_SALEOR_INSTANCE_URI} rel="noreferrer">
                {process.env.NEXT_PUBLIC_SALEOR_INSTANCE_URI}
              </a>
            </span>
          </div>
          <div className="flex flex-1 justify-center">
            <Link href={'/'} passHref legacyBehavior>
              <a href="pass" className={styles.logo}>
                <Stamp />
              </a>
            </Link>
          </div>
          <div className="flex flex-1 justify-end">
            {!authenticated ? (
              <Link href={'/login'} passHref legacyBehavior>
                <a href="pass" data-testid="userIcon">
                  <NavIconButton isButton={false} icon="user" aria-hidden="true" />
                </a>
              </Link>
            ) : (
              <div className="flex items-center">
                {user && <User firstName={user.firstName} lastName={user.lastName} email={user.email} />}
                <UserMenu />
              </div>
            )}
            <a href={externalCheckoutUrl} className="ml-2 flex" data-testid="cartIcon">
              <NavIconButton isButton={false} icon="bag" aria-hidden="true" counter={counter} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar

const User = ({ firstName, lastName, email }: { firstName: string; lastName: string; email: string }) => {
  const name = firstName.length > 0 && lastName.length > 0 ? `${firstName} ${lastName}` : email
  return (
    <div>
      <span>Hello, {name}</span>
    </div>
  )
}
