import React from 'react'
import styled from 'styled-components'
import BGImg from '../../assets/images/trees_bg.png'

const SwapBGView = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url(${BGImg});
  background-size: 100% auto;
  background-position: left bottom;
  background-repeat: no-repeat;
  ${({ theme }) => theme.mediaWidth.upToSmall`
            background-size: auto 130px;
          `};
`
const SwapBox = styled(SwapBGView)`
  padding: 30px 0;
  overflow-y: auto;
`

export default function SwapBG({ children }: { children: React.ReactNode }) {
  return (
    <SwapBGView>
      <SwapBox>{children}</SwapBox>
    </SwapBGView>
  )
}
