import { ChainId, JSBI, Percent, Token, WETH } from '@etmp/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import IOSIcon from '../assets/images/ios_icon.svg'
import TotoroAbi from './abis/totoro.json'
import { injected, walletconnect, walletlink } from '../connectors'

export const ROUTER_ADDRESS = '0xAf3EDBcCAe958FB1b3C481494A41bB076C169caf'

export const ROUTER_ADDRESS_MAP: { [propName: string]: string } = {
  '36': '0x7D491350E3257198D7376A7286A2b771145f5367',
  '37': '0xAf3EDBcCAe958FB1b3C481494A41bB076C169caf'
}
export const getRouterContractAddress = (chainId?: number) => {
  return ROUTER_ADDRESS_MAP[chainId || ChainId.ETMP]
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export { PRELOADED_PROPOSALS } from './proposals'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const USDC = new Token(ChainId.ETMP, '0x94C27baBD5166b7AFBc49C5919CA2De57753b4FC', 18, 'USDC', 'USDC')
export const USDT = new Token(ChainId.ETMP, '0x97B2B4EcF9F620d6bAA57E9095F82801461C8310', 18, 'USDT', 'Tether USD')
export const ETH = new Token(ChainId.ETMP, '0x2E1AA15B319ef5a270771F538561d0214F2224D5', 18, 'ETH', 'ETH')
//
export const BUSD = new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD')
export const DAI = new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin')
export const WBTC = new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Binance BTC')
export const WBNB = new Token(ChainId.BSC, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB')

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const TIMELOCK_ADDRESS = '0x73b50dA49C400e4081e92dCBCB397A01dF3497e4'

const TOTORO_ADDRESS = '0x6367b00bB18B72Be512efeB275E0f420f2203E11'
// A pop-up window is displayed in the breakdown of UIN, the voting authorization pop-up window, the management voting page,
// the prompt box on the right of successful transaction, and the pool displays the liquidity list
export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, TOTORO_ADDRESS, 18, 'TOTORO', 'TOTORO'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, TOTORO_ADDRESS, 18, 'TOTORO', 'TOTORO'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, TOTORO_ADDRESS, 18, 'TOTORO', 'TOTORO'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, TOTORO_ADDRESS, 18, 'TOTORO', 'TOTORO'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, TOTORO_ADDRESS, 18, 'TOTORO', 'TOTORO'),
  [ChainId.BSC]: new Token(ChainId.BSC, TOTORO_ADDRESS, 18, 'TOTORO', 'TOTORO'),
  [ChainId.ETMP]: new Token(ChainId.ETMP, TOTORO_ADDRESS, 18, 'TOTORO', 'TOTORO'),
  [ChainId.ETMPTest]: new Token(ChainId.ETMPTest, TOTORO_ADDRESS, 18, 'TOTORO', 'TOTORO')
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.BSC]: [WETH[ChainId.BSC]],
  [ChainId.ETMP]: [WETH[ChainId.ETMP]],
  [ChainId.ETMPTest]: [WETH[ChainId.ETMPTest]]
}

// Composition is used to construct mediation pairs for transactions
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.ETMP]: [...WETH_ONLY[ChainId.ETMP], USDC, USDT, ETH],
  [ChainId.ETMPTest]: [...WETH_ONLY[ChainId.ETMPTest]]
}

export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    '0xA948E86885e12Fb09AfEF8C52142EBDbDf73cD18': [new Token(ChainId.MAINNET, TOTORO_ADDRESS, 18, 'UNI', 'Uniswap')],
    '0x561a4717537ff4AF5c687328c0f7E90a319705C0': [new Token(ChainId.MAINNET, TOTORO_ADDRESS, 18, 'UNI', 'Uniswap')]
  }
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    // [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.BSC]: [...WETH_ONLY[ChainId.BSC], DAI, USDC, USDT, WBTC, ETH, BUSD]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.BSC]: [...WETH_ONLY[ChainId.BSC], DAI, USDC, USDT, WBTC, ETH, BUSD]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BSC]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC, USDT],
    [DAI, USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamaskRound.svg',
    description: 'Connect using browser wallet',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIconRound.svg',
    description: 'Connect using mobile wallet',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Connect using Coinbase wallet',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]

export const TOTORO_TOKEN_INFO = {
  icon: IOSIcon,
  address: TOTORO_ADDRESS,
  symbol: 'TOTORO',
  decimals: 18,
  abi: TotoroAbi
}

export const ADDRESS_INFINITE = '0xffffffffffffffffffffffffffffffffffffffff'
export const ADDRESS_0 = '0x0000000000000000000000000000000000000000'
