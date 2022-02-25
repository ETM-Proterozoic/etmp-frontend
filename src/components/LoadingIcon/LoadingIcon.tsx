import React from 'react'
import { Loader } from 'react-feather'
import styled from 'styled-components'

const Icon = styled.span`
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  line-height: 0;
  margin-right: 5px;
  animation: rotate 1.5s infinite linear;
`
export default function LoadingIcon({ size = 16 }: any) {
  return (
    <Icon>
      <Loader size={size} />
    </Icon>
  )
}
