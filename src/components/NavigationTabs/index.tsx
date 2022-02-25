import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { RowBetween } from '../Row'
// import QuestionHelper from '../QuestionHelper'
import Settings from '../Settings'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { resetMintState } from 'state/mint/actions'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { FlexCenterH } from '../../theme'

const BackIcon = styled(BackSvg)`
  width: 24px;
  height: 24px;
  path {
    stroke: ${({ theme }) => theme.text3};
  }
`

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const ActiveText = styled.div`
  margin-left: 10px;
  & > p:nth-child(1) {
    font-weight: 500;
    font-size: 18px;
    line-height: 18px;
    margin: 0;
    padding: 0;
  }
  & > p:nth-child(2) {
    font-size: 12px;
    line-height: 12px;
    margin: 8px 0 0 0;
    padding: 0;
  }
`
const SwapTabs = styled.div`
  min-width: 240px;
  margin: auto auto 40px auto;
  display: flex;
  box-shadow: 0px 4px 0px 0px ${({ theme }) => theme.shadow3};
  border-radius: 24px;
  background: ${({ theme }) => theme.bg12};
  padding-bottom: 4px;
`
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  height: 40px;
  padding: 0 40px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primary1};
  font-size: 16px;
  font-weight: bold;

  &.${activeClassName} {
    background: ${({ theme }) => theme.primary1};
    color: ${({ theme }) => theme.text8};
    box-shadow: 0 4px 0 0 ${({ theme }) => theme.shadow2};
  }

  :hover,
  :focus {
    opacity: 0.95;
  }
`
const TabsLeft = styled.div`
  ${FlexCenterH};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'liquidity' }) {
  const { t } = useTranslation()
  return (
    <SwapTabs>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        {t('swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/liquidity'} isActive={() => active === 'liquidity'}>
        {t('liquidity')}
      </StyledNavLink>
    </SwapTabs>
  )
}

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '24px 24px 0' }}>
        <TabsLeft>
          <HistoryLink to="/liquidity">
            <BackIcon />
          </HistoryLink>
          <ActiveText>
            <p>Import Pool</p>
            <p>Import an existing pool</p>
          </ActiveText>
        </TabsLeft>
        <Settings />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding, creating }: { adding: boolean; creating: boolean }) {
  // reset states on back
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Tabs>
      <RowBetween style={{ padding: '24px 24px 0' }}>
        <TabsLeft>
          <HistoryLink
            to="/liquidity"
            onClick={() => {
              adding && dispatch(resetMintState())
            }}
          >
            <BackIcon />
          </HistoryLink>
          <ActiveText>
            {creating ? (
              <>
                <p>Create a pair</p>
                <p></p>
              </>
            ) : adding ? (
              <>
                <p>Add Liquidity</p>
                <p>Add liquidity to receive LP tokens</p>
              </>
            ) : (
              <>
                <p>Remove Liquidity</p>
                <p>Remove liquidity to receive tokens</p>
              </>
            )}
          </ActiveText>
        </TabsLeft>
        <Settings />
      </RowBetween>
    </Tabs>
  )
}
