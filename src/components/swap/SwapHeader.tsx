import React from 'react'
import styled from 'styled-components'
import Settings from '../Settings'
import { RowBetween } from '../Row'
interface Props {
  title: string
  desc?: string
}
const StyledSwapHeader = styled.div`
  padding: 24px 24px 0 24px;
  width: 100%;
  max-width: 436px;
  color: ${({ theme }) => theme.text8};
`
const TitleText = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.text3};
  line-height: 24px;
`
const DescText = styled.div`
  color: ${({ theme }) => theme.text3};
  font-size: 12px;
  line-height: 12px;
  margin-top: 2px;
`
const TitleMenu = styled.div`
  display: flex;
  align-items: center;
`

export default function SwapHeader({ title, desc }: Props) {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <div>
          <TitleText>{title}</TitleText>
          <DescText>{desc}</DescText>
        </div>
        <TitleMenu>
          <Settings />
        </TitleMenu>
      </RowBetween>
    </StyledSwapHeader>
  )
}
