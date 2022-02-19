import styled from 'styled-components'
import React from 'react'
interface Props {
  size: string
  src: any
  color: string
}
const SvgPlusBox = styled.div<{ size: string }>`
  position: relative;
  display: inline-block;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  overflow: hidden;
`
const SvgPlusView = styled.img<{ size: string; color: string }>`
  position: absolute;
  left: -${({ size }) => size};
  top: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(${({ color }) => color} ${({ size }) => size} 0);
`

export default function SvgPlus(props: Props) {
  return (
    <SvgPlusBox size={props.size}>
      <SvgPlusView src={props.src} size={props.size} color={props.color} />
    </SvgPlusBox>
  )
}
