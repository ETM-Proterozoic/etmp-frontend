import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import { PortisConnector } from '@web3-react/portis-connector'
// import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import UNISWAP_LOGO_URL from '../assets/svg/logo.svg'
import { ChainId } from '@etmp/sdk'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL
const WALLETCONNECT_BRIDGE_URL = process.env.REACT_APP_WALLETCONNECT_BRIDGE_URL
const REACT_APP_CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.ETMPTest, ChainId.RINKEBY, ChainId.MAINNET, ChainId.ETMP]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  rpc: { [REACT_APP_CHAIN_ID]: NETWORK_URL },
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true
  // pollingInterval: 15000
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'ETMPSwap',
  appLogoUrl: UNISWAP_LOGO_URL
})
