import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { FlexCenterH } from '../../theme'

export const SidebarMenuView = styled.div`
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg1};
  .menu-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 240px;
  `};
`
export const MenuItem = styled(NavLink)<{ src: any }>`
  ${() => FlexCenterH}
  height: 44px;
  text-decoration: none;
  background: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text3};
  font-weight: 500;
  border-radius: 8px;
  margin: 20px 0px;
  & > div {
    margin: 0 12px 0 16px;
  }
  &:hover {
    color: ${({ theme }) => theme.primary1};
  }
  &.active {
    background: ${({ theme }) => theme.menuActiveBg};
    color: ${({ theme }) => theme.primary1};
    & > div {
      background: url(${({ src }) => src});
    }
  }
`

export const MenuIcon = styled.div<{ src: any }>`
  width: 24px;
  height: 24px;
  background: url(${({ src }) => src});
  background-size: 100% 100%;
`

export const HideSmall = styled.div<{ open: boolean }>`
  transition: all 200ms;
  //width: ${({ open }) => (open ? '52px' : '240px')};
  overflow: hidden;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`
export const ShowSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`
