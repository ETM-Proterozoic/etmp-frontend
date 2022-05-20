import React, { ReactNode } from 'react'
import SidebarMenu from '../SidebarMenu'
import Header from '../Header'
import { LayoutView } from './style'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <LayoutView>
      <Header />
      <div className="layout-main">
        <SidebarMenu />
        <div className="layout-box">{children}</div>
      </div>
    </LayoutView>
  )
}
