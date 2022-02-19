import React, { useEffect, useRef, useState } from 'react'
import { BookOpen, Code, Moon, Sun, ChevronLeft } from 'react-feather' // Globe
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { ReactComponent as MenuLineIcon } from '../../assets/svg/menu_line.svg'

import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { ExternalLink } from '../../theme'
import { useDarkModeManager } from '../../state/user/hooks'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../i18n'
import Drawer from '../Drawer'
import { NavLink } from 'react-router-dom'
const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`
const StyledMenuH5Button = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display:block;
  `}
`
const StyledMenuButton = styled.button`
  width: 42px;
  height: 38px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bg1};
  padding: 0.15rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  cursor: pointer;
  svg {
    margin-top: 2px;
  }
  margin-left: 8px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width:36px;
    height: 30px;
    border-radius: 6px;
  `}
`

const StyledMenu = styled.div`
  margin-left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  width: 182px;
  padding: 22px;
  background-color: ${({ theme }) => theme.bg8};
  box-shadow: 0px 2px 5px ${({ theme }) => theme.shaw1};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 100;
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.5rem;
  font-size: 16px;
  color: ${({ theme }) => theme.text2};
  white-space: nowrap;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`
const MenuItemSty = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.5rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`
const BackIcon = styled.span`
  position: absolute;
  left: 10px;
  top: 10px;
  cursor: pointer;
`
const activeClassName = 'ACTIVE'
const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  display: block;
  margin: auto;
  width: 248px;
  height: 40px;
  max-width: 90%;
  padding-left: 16px;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  margin-bottom: 10px;
  &.${activeClassName} {
    background: linear-gradient(90deg, #0acffe 0%, #495aff 100%);
    border-radius: 12px;
    height: 36px;
    line-height: 36px;
    color: #ffffff;
  }
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  const [darkMode, toggleDarkMode] = useDarkModeManager()
  useOnClickOutside(node, open ? toggle : undefined)
  const [showLanguage, setShowLanguage] = useState(false)
  const { i18n } = useTranslation()
  const changeLanguage = (key: string) => {
    setShowLanguage(false)
    i18n.changeLanguage(key)
  }
  useEffect(() => {
    setShowLanguage(false)
  }, [open])
  // const languageCheck = LANGUAGES.find(i => i.key === i18n.language)
  const [showDrawer, setShowDrawer] = useState(false)
  return (
    <>
      <StyledMenu ref={node as any}>
        <StyledMenuButton onClick={toggle}>
          <StyledMenuIcon />
        </StyledMenuButton>
        <StyledMenuH5Button>
          <StyledMenuButton onClick={() => setShowDrawer(true)}>
            <MenuLineIcon />
          </StyledMenuButton>
        </StyledMenuH5Button>
        {open && (
          <MenuFlyout>
            <MenuItem id="link" href="https://totoroswap.gitbook.io/totoroswap/">
              <BookOpen size={19} />
              Docs
            </MenuItem>
            <MenuItem id="link" href="https://github.com/totoroswap">
              <Code size={19} />
              Code
            </MenuItem>
            {/*<MenuItemSty id="link" onClick={() => setShowLanguage(true)}>*/}
            {/*  <Globe size={19} />*/}
            {/*  {languageCheck && languageCheck.name}*/}
            {/*</MenuItemSty>*/}
            <MenuItemSty id="link" onClick={toggleDarkMode}>
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              {darkMode ? 'Light Theme' : 'Dark Theme'}
            </MenuItemSty>
          </MenuFlyout>
        )}
        {showLanguage && (
          <MenuFlyout>
            <BackIcon onClick={() => setShowLanguage(false)}>
              <ChevronLeft size={20} />
            </BackIcon>
            {LANGUAGES.map(item => (
              <MenuItemSty key={item.key} onClick={() => changeLanguage(item.key)}>
                {item.name}
              </MenuItemSty>
            ))}
          </MenuFlyout>
        )}
      </StyledMenu>
      <Drawer placement="left" onClose={() => setShowDrawer(false)} visible={showDrawer}>
        <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
          {/*{t('swap')}*/}
          Exchange
        </StyledNavLink>
        <StyledNavLink
          id={`pool-nav-link`}
          to={'/liquidity'}
          isActive={(match, { pathname }) =>
            Boolean(match) ||
            pathname.startsWith('/add') ||
            pathname.startsWith('/remove') ||
            pathname.startsWith('/create') ||
            pathname.startsWith('/find')
          }
        >
          {/*{t('pool')}*/}
          Liquidity
        </StyledNavLink>
        {/*<StyledNavLink id={`swap-nav-link`} to={'/farms'}>*/}
        {/*  /!*{t('farms')}*!/*/}
        {/*  Farms*/}
        {/*</StyledNavLink>*/}
        {/*<StyledNavLink id={`swap-nav-link`} to={'/tradeBonus'}>*/}
        {/*  /!*{t('tradeBonus')}*!/*/}
        {/*  Trade Bonus*/}
        {/*</StyledNavLink>*/}
        {/*<StyledNavLink id={`swap-nav-link`} to={'/pools'}>*/}
        {/*  /!*{t('pools')}*!/*/}
        {/*  Pools*/}
        {/*</StyledNavLink>*/}
        {/*<StyledNavLink id={`swap-nav-link`} to={'/dividends'}>*/}
        {/*  /!*{t('dividends')}*!/*/}
        {/*  Dividends*/}
        {/*</StyledNavLink>*/}
      </Drawer>
    </>
  )
}
