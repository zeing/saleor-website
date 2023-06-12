import clsx from 'clsx'
import Link from 'next/link'
import { HTMLAttributes } from 'react'
import { useIntl } from 'react-intl'

import { useLogout } from '@/utils/hooks/useLogout'

import styles from './Navbar.module.css'
import NavIconButton from './NavIconButton'
import { message, formatMessage } from '@/i18n/translate.helper'

type UserMenuProps = Pick<HTMLAttributes<HTMLDivElement>, 'className'>

function UserMenu({ className, ...rest }: UserMenuProps) {
  const t = useIntl()

  const onLogout = useLogout()

  return (
    <div className={clsx(styles['user-menu-container'], className)} {...rest}>
      <NavIconButton icon="user" aria-hidden="true" />
      <div className={styles['user-menu']}>
        <Link href={'/'} passHref legacyBehavior>
          <a tabIndex={0} className={styles['user-menu-item']} href="pass">
            ข้อมูลส่วนตัว
          </a>
        </Link>
        <button type="button" onClick={onLogout} tabIndex={-1} className={styles['user-menu-item']}>
          {formatMessage(message.logout)}
        </button>
      </div>
    </div>
  )
}

export default UserMenu
