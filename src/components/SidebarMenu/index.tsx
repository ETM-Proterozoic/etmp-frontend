import React from 'react'
import bridgeOff from '../../assets/svg/menu/bridge-off.svg'
import bridgeOn from '../../assets/svg/menu/bridge-on.svg'
import stakingOff from '../../assets/svg/menu/staking-off.svg'
import stakingOn from '../../assets/svg/menu/staking-on.svg'
import tokenswapOff from '../../assets/svg/menu/tokenswap-off.svg'
import tokenswapOn from '../../assets/svg/menu/tokenswap-on.svg'
import { SidebarMenuView, MenuItem, ShowSmall, HideSmall, MenuIcon } from './style'
import Drawer from '../Drawer'
import { useCloseModals, useModalOpen } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'

const sidebarMenuList = [
  {
    icon: {
      off: stakingOff,
      on: stakingOn
    },
    name: 'Staking',
    route: '/staking'
  },
  {
    icon: {
      off: bridgeOff,
      on: bridgeOn
    },
    name: 'Bridge',
    route: '/bridge'
  },
  {
    icon: {
      off: tokenswapOff,
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
interface MenuProps {
  drawer: boolean
}

export default function SidebarMenu() {
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useCloseModals()
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
