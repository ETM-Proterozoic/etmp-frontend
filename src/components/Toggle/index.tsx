import React from 'react'
import styled from 'styled-components'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text3) : theme.text3)};
  font-size: 14px;

  padding: 0.3rem 0.6rem;
  border-radius: 12px;

  background: ${({ theme, isActive, isOnSwitch }) =>
    isActive
      ? isOnSwitch
        ? 'linear-gradient(90deg, ' + theme.primary3 + ' 0%, ' + theme.primary2 + ' 100%)'
        : theme.bg9
      : theme.bg1};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.white) : theme.text3)};
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
    opacity: 0.9;
  }
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.bg1};
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;
`
const StyledToggleBox = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 0;
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  return (
    <StyledToggleBox>
      <StyledToggle id={id} isActive={isActive} onClick={toggle}>
        <ToggleElement isActive={isActive} isOnSwitch={true}>
          On
        </ToggleElement>
        <ToggleElement isActive={!isActive} isOnSwitch={false}>
          Off
        </ToggleElement>
      </StyledToggle>
    </StyledToggleBox>
  )
}
