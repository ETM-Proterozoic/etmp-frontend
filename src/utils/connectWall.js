import { useWeb3React } from '@web3-react/core'
import { useCallback, useMemo } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ChainId } from '@totoroswap/sdk'
export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.BSC]
})
export const networkConf = {
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com']
  }
}

export const changeNetwork = chainId =>
  new Promise(reslove => {
    const { ethereum } = window
    if (ethereum && ethereum.isMetaMask) {
      ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networkConf[chainId]
            }
          ]
        })
        .then(() => {
          setTimeout(reslove, 500)
        })
    } else {
      reslove()
    }
  })

export const useConnectWallet = () => {
  const { activate, deactivate, active } = useWeb3React()
  const connectWallet = useCallback(
    (connector, chainId) =>
      changeNetwork(chainId).then(() =>
        activate(connector, undefined, true).then(e => {
          if (window.ethereum && window.ethereum.on) {
            window.ethereum.on('accountsChanged', accounts => {
              if (accounts.length === 0) {
                deactivate()
              }
            })
            window.ethereum.on('disconnect', () => {
              deactivate()
            })
            window.ethereum.on('close', () => {
              deactivate()
            })
            window.ethereum.on('message', message => {
              console.log('message', message)
            })
          }
        })
      ),
    []
  )

  useMemo(() => {
    // !active && connectWallet(injected)
    window.ethereum &&
      window.ethereum.on('networkChanged', () => {
        !active && connectWallet(injected)
      })
  }, [])
  return connectWallet
}
