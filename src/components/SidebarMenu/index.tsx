import React from 'react'
import bridgeOff from '../../assets/svg/menu/bridge-off.svg'
import bridgeOffDark from '../../assets/svg/menu/bridge-off-dark.svg'
import bridgeOn from '../../assets/svg/menu/bridge-on.svg'
import stakingOff from '../../assets/svg/menu/staking-off.svg'
import stakingOffDark from '../../assets/svg/menu/staking-off-dark.svg'
import stakingOn from '../../assets/svg/menu/staking-on.svg'
import tokenswapOff from '../../assets/svg/menu/tokenswap-off.svg'
import tokenswapOffDark from '../../assets/svg/menu/tokenswap-off-dark.svg'
import tokenswapOn from '../../assets/svg/menu/tokenswap-on.svg'
import footerIcon from '../../assets/svg/menu/footer-icon.svg'
import footerIconDark from '../../assets/svg/menu/footer-icon-dark.svg'
import { SidebarMenuView, MenuItem, ShowSmall, HideSmall, MenuIcon } from './style'
import Drawer from '../Drawer'
import { useCloseModals, useModalOpen } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useDarkModeManager } from '../../state/user/hooks'

interface MenuProps {
  drawer: boolean
}

export default function SidebarMenu() {
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useCloseModals()
  const [isDark] = useDarkModeManager()

  const sidebarMenuList = [
    {
      icon: {
        off: isDark ? stakingOffDark : stakingOff,
        on: stakingOn
      },
      name: 'Staking',
      route: '/staking'
    },
    {
      icon: {
        off: isDark ? bridgeOffDark : bridgeOff,
        on: bridgeOn
      },
      name: 'Bridge',
      route: '/bridge'
    },
    {
      icon: {
        off: isDark ? tokenswapOffDark : tokenswapOff,
        on: tokenswapOn
      },
      name: 'Token Swap',
      route: '/swap'
    }
    // {
    //   icon: ,
    //   name: 'Liquidity',
    //   route: '/liquidity'
    // }
  ]

  const MenuContent = ({ drawer }: MenuProps) => {
    return (
      <SidebarMenuView>
        <div className="menu-list">
          {sidebarMenuList.map((item, index) => (
            <MenuItem key={index} to={item.route} onClick={() => (drawer ? toggle() : null)} src={item.icon.on}>
              <MenuIcon src={item.icon.off} />
              <span>{item.name}</span>
            </MenuItem>
          ))}
        </div>
        <a href={'https://testnet-app.etm3.com/'} target="_blank" className="menu-footer" rel="noreferrer">
          <img src={isDark ? footerIconDark : footerIcon} alt="" />
          Dev Testnet
        </a>
      </SidebarMenuView>
    )
  }
  return (
    <>
      <HideSmall open={open}>
        <MenuContent drawer={false} />
      </HideSmall>
      <ShowSmall>
        <Drawer placement="left" onClose={toggle} visible={open} vWidth="auto" topBlank="65px">
          <MenuContent drawer={true} />
        </Drawer>
      </ShowSmall>
    </>
  )
}