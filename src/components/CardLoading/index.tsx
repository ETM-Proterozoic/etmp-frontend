import React from 'react'
import styled, { keyframes } from 'styled-components'
import LoadingDarkSvg from '../../assets/svg/loading_dark.svg'

import LoadingWhiteSvg from '../../assets/svg/loading_white.svg'
import { useDarkModeManager } from '../../state/user/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const Mask = styled.div<any>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.mask1};
  border-radius: 12px;
  backdrop-filter: blur(10px);
  img {
    width: 40px;
    height: 40px;
    animation: 1.5s ${rotate360} linear infinite;
  }
`

const ConnectNetwork = styled.button`
  border: 0;
  padding: 10px;
  font-size: 16px;
  color: ${({ theme }) => theme.text6};
  background: linear-gradient(90deg, ${({ theme }) => theme.gradual3} 0%, ${({ theme }) => theme.gradual4} 100%);
  cursor: pointer;
  border-radius: 10px;
`

interface Props {
  visible: boolean
}
export default function CardLoading({ visible = false }: Props) {
  const [isDark] = useDarkModeManager()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  if (!visible && account) {
    return null
  }
  return (
    <Mask active={account}>
      {account ? (
        <img src={isDark ? LoadingWhiteSvg : LoadingDarkSvg} alt="loading..." />
      ) : (
        <ConnectNetwork onClick={toggleWalletModal}>Connect to a wallet</ConnectNetwork>
      )}
    </Mask>
  )
}
