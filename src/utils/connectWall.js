import { useWeb3React } from '@web3-react/core'
import { useCallback, useMemo } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ClientChainId, multicallConfig } from '../constants/multicall'
export const injected = new InjectedConnector({
  supportedChainIds: [ClientChainId.ETM3]
})
console.log(multicallConfig.rpc[ClientChainId.ETM3])
export const networkConf = {
  [ClientChainId.ETM3]: {
    chainId: ClientChainId.ETM3.toString(16),
    chainName: 'ETM3 Mainnet',
    nativeCurrency: {
      name: 'ETM3',
      symbol: 'ETM3',
      decimals: 18
    },
    rpcUrls: [multicallConfig.rpc[ClientChainId.ETM3].url],
    blockExplorerUrls: null
  },
  [ClientChainId.ETM3Test]: {
    chainId: ClientChainId.ETM3Test.toString(16),
    chainName: 'ETM3 Testnet',
    nativeCurrency: {
      name: 'ETM3',
      symbol: 'ETM3',
      decimals: 18
    },
    rpcUrls: [multicallConfig.rpc[ClientChainId.ETM3Test].url],
    blockExplorerUrls: null
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
