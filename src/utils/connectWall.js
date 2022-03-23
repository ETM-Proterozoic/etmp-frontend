import { useWeb3React } from '@web3-react/core'
import { useCallback, useMemo } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { multicallConfig } from '../constants/multicall'
import { ChainId } from '@etm3/sdk'
export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.ETM3]
})
export const networkConf = {
  [ChainId.MAINNET]: {
    chainId: '0x1'
  },
  [ChainId.RINKEBY]: {
    chainId: '0x4'
  },
  [ChainId.ETM3]: {
    chainId: '0x24',
    chainName: 'ETM/P Mainnet',
    nativeCurrency: {
      name: 'ETM',
      symbol: 'ETM',
      decimals: 18
    },
    rpcUrls: [multicallConfig.rpc[ChainId.ETM3].url],
    blockExplorerUrls: ['https://etm3scan.com']
  },
  [ChainId.ETM3Test]: {
    chainId: '0x25',
    chainName: 'ETM/P Testnet',
    nativeCurrency: {
      name: 'ETM',
      symbol: 'ETM',
      decimals: 18
    },
    rpcUrls: [multicallConfig.rpc[ChainId.ETM3Test].url],
    blockExplorerUrls: ['https://testnet.etm3scan.com']
  }
}

export const changeNetwork = chainId =>
  new Promise(reslove => {
    const { ethereum } = window
    if (ethereum && ethereum.isMetaMask) {
      ethereum
        .request({
          method: [1, 4].includes(chainId) ? 'wallet_switchEthereumChain' : 'wallet_addEthereumChain',
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
