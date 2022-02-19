import React from 'react'
import styled, { keyframes } from 'styled-components'
import { X } from 'react-feather'
const DrawerView = styled.div<{ topBlank: string }>`
  position: fixed;
  left: 0;
  top: ${({ topBlank }) => topBlank};
  z-index: 999;
  width: 100vw;
  height: calc(100vh - ${({ topBlank }) => topBlank});
  padding: 0;
  background: rgba(0, 0, 0, 0.4);
`
const translate = keyframes`
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0);
  }
`

const DrawerViewPanel = styled.div<{ vWidth: string }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ vWidth }) => vWidth};
  max-width: 90vw;
  height: 100%;
  background: ${({ theme }) => theme.bg1};
  animation: ${translate} 200ms;
`

const XStyle = styled.span`
  /* × */

  position: absolute;
  width: 20px;
  height: 20px;
  right: 18px;
  top: 18px;
`

export default function Drawer({
  children,
  visible,
  onClose,
  showCloseBtn = false,
  topBlank = '0px',
  vWidth = '280px'
}: any) {
  if (!visible) {
    return null
  }
  return (
    <DrawerView onClick={onClose} topBlank={topBlank}>
      <DrawerViewPanel
        vWidth={vWidth}
        onClick={e => {
          e.stopPropagation()
          return false
        }}
      >
        {showCloseBtn && (
          <XStyle onClick={onClose}>
            <X size={20}></X>
          </XStyle>
        )}
        {children}
      </DrawerViewPanel>
    </DrawerView>
  )
}
