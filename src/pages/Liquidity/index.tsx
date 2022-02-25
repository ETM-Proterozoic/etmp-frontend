import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair, JSBI } from '@totoroswap/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { Text } from 'rebass'
import { ButtonSecondary, TButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'

import SwapBG from '../../components/SwapBG'
import SwapHeader from '../../components/swap/SwapHeader'
import AppBody from '../AppBody'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  margin: auto;
  width: 100%;
`

const DataList = styled.div`
  margin-top: 40px;
  padding: 24px 24px 30px 24px;
  text-align: center;
  background: ${({ theme }) => theme.bg13};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  border-radius: 20px !important;
  margin: 30px auto auto;
  border: 2px solid ${({ theme }) => theme.primary1};
  &:hover {
    border: 2px solid ${({ theme }) => theme.primary1};
    opacity: 0.95;
  }
`

const EmptyProposals = styled.div`
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Footer = styled.div`
  padding: 30px 20px;
`

export default function Liquidity() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  return (
    <SwapBG>
      <PageWrapper>
        <SwapPoolTabs active={'liquidity'} />
        <AppBody>
          <SwapHeader title="Your Liquidity" desc="Remove liquidity to receive tokens back" />
          <DataList>
            {!account ? (
              <Text style={{ margin: '40px 0 30px 0' }}>Connect to a wallet to view your liquidity.</Text>
            ) : v2IsLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
              <>
                {v2PairsWithoutStakedAmount.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
                {stakingPairs.map(
                  (stakingPair, i) =>
                    stakingPair[1] && ( // skip pairs that arent loaded
                      <FullPositionCard
                        key={stakingInfosWithBalance[i].stakingRewardAddress}
                        pair={stakingPair[1]}
                        stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                      />
                    )
                )}
                <Text fontSize="14px" marginBottom="10px">
                  Don&apos;t you see the liquidity pool you joined?
                </Text>
                <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/find">
                  Find other LP tokens
                </ResponsiveButtonSecondary>
              </>
            ) : (
              <>
                <Text fontSize="14px" marginBottom="10px">
                  No liquidity found.
                </Text>
                <Text fontSize="14px" marginBottom="10px">
                  Don&apos;t you see the liquidity pool you joined?
                </Text>
                <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/find">
                  Find other LP tokens
                </ResponsiveButtonSecondary>
              </>
            )}
          </DataList>
          {account && allV2PairsWithLiquidity?.length === 0 && stakingPairs?.length === 0 && (
            <Footer>
              <TButtonPrimary as={Link} height="40px" to="/add/BNB">
                Add Liquidity
              </TButtonPrimary>
            </Footer>
          )}
        </AppBody>
      </PageWrapper>
    </SwapBG>
  )
}
