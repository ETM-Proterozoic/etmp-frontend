import React from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useContractBalances } from '../../state/wallet/hooks'

import Web3Status from '../Web3Status'
import { useDarkModeManager } from '../../state/user/hooks'
import BigNumber from 'bignumber.js'
import { formatLastZero } from '../../utils/format'
import { TOTORO_TOKEN_INFO } from '../../constants'
import LogWhiteSvg from '../../assets/svg/logo_white.svg'
import LogDarkSvg from '../../assets/svg/logo_dark.svg'
import MenuTabSvg from '../../assets/svg/menu/menu_tab.svg'
import cx from 'classnames'
import { Switch } from 'antd'

import { HeaderView, Logo } from './style'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'

export default function Header() {
  const { account } = useActiveWeb3React()
  // const { t } = useTranslation()
  const userEthBalance = useContractBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()

  const prettyBalance = (balance: any) => {
    const b = formatLastZero(new BigNumber(balance).toFixed(6))
    return Number(b) < 0.000001 ? 0 : b
  }

  const toggle = useToggleModal(ApplicationModal.MENU)
  const open = useModalOpen(ApplicationModal.MENU)
  const [darkMode, toggleDarkMode] = useDarkModeManager()
  return (
    <>
      <HeaderView>
        <div className="header-left">
          <img className={cx({ 'menu-tab': true, open })} src={MenuTabSvg} alt="" onClick={toggle} />
          <Logo src={darkMode ? LogDarkSvg : LogWhiteSvg} />
        </div>
        <div className="header-center" />
        <div className="header-right">
          {false && account && (
            <div className="balance">
              {prettyBalance(userEthBalance?.toSignificant(4))} {TOTORO_TOKEN_INFO.symbol}
            </div>
          )}
          <Switch
            checkedChildren={<span>light</span>}
            unCheckedChildren={<span>dark</span>}
            checked={darkMode}
            onChange={toggleDarkMode}
            className="theme-switch"
          />
          <Web3Status />
        </div>
      </HeaderView>
    </>
  )
}
