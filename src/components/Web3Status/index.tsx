import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import React, { useMemo } from 'react'
import { Activity } from 'react-feather'
import styled from 'styled-components'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { injected, walletconnect, walletlink } from '../../connectors'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import MetamaskSvg from '../../assets/svg/metamask.svg'
import ArrowDown from '../../assets/svg/arrow_down3.svg'

import Identicon from '../Identicon'
import Loader from '../Loader'

import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'
import { FlexCenter } from '../../theme'
import { changeNetwork } from '../../utils/connectWall'
import { ChainId } from '@etmp/sdk'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

export const Web3StatusConnect = styled.div<{ faded?: boolean }>`
  ${() => FlexCenter}
  background: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text8};
  width: 171px;
  height: 45px;
  right: 0px;
  top: calc(50% - 45px/2);

  /* Theme/Dark/Gradient */
  font-family: PingFang SC;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;

  background: ${({ theme }) => theme.connectWalletBg};
  border-radius: 8px;
  margin-right: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.95;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 35px;
    margin-right: 10px;
  `};
`

export const Web3SwitchNetwork = styled.button`
  ${() => FlexCenter}
  background: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text8};
  width: 171px;
  min-width: 171px;
  height: 45px;
  position: relative;
  background: #017bff;
  overflow: visible;
  border-radius: 8px;
  border: 0;
  font-weight: 600;
  font-size: 18px;
  margin-right: 20px;
  cursor: pointer;
  & > img {
    margin-left: 5px;
    width: 10px;
    height: 10px;
  }
  &:hover {
    .switch-network {
      display: block;
    }
  }
  .switch-network {
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 3;
    width: 100%;
    padding-top: 5px;
    .switch-network-list {
      background: #017BFF;
      box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.1), 5px 30px 71px rgba(20, 37, 63, 0.08);
      border-radius: 20px;
      color: ${({ theme }) => theme.white};
      padding: 20px 16px;
      & > div {
        text-align: left;
        padding: 14px 16px;
        border-radius: 8px;
        &.active,&:hover{
          background: rgba(248, 249, 250, 0.2);
        }
        margin-top: 10px;
        &:nth-child(1){
          margin-top: 0;
        }
      }
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
          width: 150px;
          min-width: 150px;
         .switch-network {
           .switch-network-list{
             padding: 10px 8px;
             & > div {
              padding: 7px 8px;
             }
           }
         }
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
         display: none;
  `}
`

const Web3StatusError = styled(Web3StatusConnect)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  border-radius: 24px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
  padding: 0 5px;
  margin-right: 20px;
  background-color: ${({ theme }) => theme.yellow2};
  border-color: ${({ theme }) => theme.yellow2};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  box-shadow: 0 0 0 0;
`
const Web3StatusConnected = styled(Web3StatusConnect)<{ pending?: boolean }>`
  width: auto;
  padding: 0 10px;
`
const WalletConnected = styled.div`
  padding: 10px 20px;
  height: 45px;
  background: ${({ theme }) => theme.accountBtnBg};
  font-weight: 500;
  font-size: 18px;
  line-height: 25px;
  color: ${({ theme }) => theme.text1};
  border-radius: 5px;
  margin-right: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
         line-height: 16px;
         margin-right: 20px;
        padding: 10px 15px;
  `}
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`
const TextPc = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        display: none;
  `}
`
const TextH5 = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        display: inline;
  `}
`
const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  return null
  if (connector === injected) {
    return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={''} />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner() {
  const { account, connector, error } = useWeb3React()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return hasPendingTransactions ? (
      <Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal} pending={hasPendingTransactions}>
        <RowBetween>
          <Text>{pending?.length} Pending</Text> <Loader stroke="white" />
        </RowBetween>
        {connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    ) : (
      <WalletConnected onClick={toggleWalletModal}>
        <img src={MetamaskSvg} alt="" />
        <TextPc>{ENSName || shortenAddress(account, 4)}</TextPc>
        <TextH5>{ENSName || shortenAddress(account, 2)}</TextH5>
      </WalletConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Web3StatusError>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        Connect Wallet
      </Web3StatusConnect>
    )
  }
}

const superNetWork = [
  {
    name: 'Proterozoic',
    chainId: 36
  },
  {
    name: 'Pioneer',
    chainId: 37
  }
]
const netWorkNameMap: { [propsName: string]: string } = {
  '36': 'Proterozoic',
  '37': 'Pioneer',
  '1': 'ETH',
  '4': 'Rinkeby'
}

export default function Web3Status() {
  const { active, account, chainId } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)
  if (!contextNetwork.active && !active) {
    return null
  }
  return (
    <>
      <Web3StatusInner />
      <Web3SwitchNetwork>
        <span>{netWorkNameMap[chainId || ChainId.ETMP]}</span>
        <img src={ArrowDown} />
        <div className="switch-network">
          <div className="switch-network-list">
            {superNetWork.map(item => (
              <div
                key={item.chainId}
                onClick={() => changeNetwork(item.chainId)}
                className={chainId === item.chainId ? 'active' : ''}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </Web3SwitchNetwork>
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
