import { useWeb3React } from '@web3-react/core'
import { useCallback, useMemo } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { multicallConfig } from '../constants/multicall'
import { ChainId } from '@etmp/sdk'
export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.ETMPTest, ChainId.RINKEBY, ChainId.MAINNET, ChainId.ETMP]
})
export const networkConf = {
  [ChainId.MAINNET]: {
    chainId: '0x1'
  },
  [ChainId.RINKEBY]: {
    chainId: '0x4'
  },
  [ChainId.ETMP]: {
    chainId: '0x24',
    chainName: 'ETM/P Mainnet',
    nativeCurrency: {
      name: 'ETMP',
      symbol: 'ETMP',
      decimals: 18
    },
    rpcUrls: [multicallConfig.rpc[ChainId.ETMP].url],
    blockExplorerUrls: ['https://etmscan.network/']
  },
  [ChainId.ETMPTest]: {
    chainId: '0x25',
    chainName: 'ETM/P Testnet',
    nativeCurrency: {
      name: 'ETMP',
      symbol: 'ETMP',
      decimals: 18
    },
    rpcUrls: [multicallConfig.rpc[ChainId.ETMPTest].url],
    blockExplorerUrls: ['https://testnet.etmscan.network/']
  },
  [97]: {
    chainId: '0x61',
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: [multicallConfig.rpc[97].url],
    blockExplorerUrls: ['https://testnet.bscscan.com/']
  }
}

export const changeNetwork = chainId => {
  console.log('chainId', chainId)
  return new Promise(reslove => {
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
}

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
