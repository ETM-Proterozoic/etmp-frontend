import { ChainId } from '@etmp/sdk'
import MULTICALL_ABI from './abi.json'

import {
  config,
  multicallClient,
  Contract as ClientContract,
  // ChainId,
  Config,
  rpcMap,
  newContract
} from '@chainstarter/multicall-client.js'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// ChainId.ETMP = 36
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// ChainId.ETMPTest = 37

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// ChainId.RINKEBY = 4
const rpc: rpcMap = {
  [ChainId.RINKEBY]: {
    url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696'
  },
  [ChainId.ETMP]: {
    url: 'https://rpc.etm.network/',
    address: ''
  },
  [ChainId.ETMPTest]: {
    url: 'https://testnet-rpc.etm.network',
    address: '0xffc5b38A7Dc497ef16121Ac948277a704a79f77b'
  }
}

const configData: Config = {
  defaultChainId: ChainId.RINKEBY,
  allowFailure: false,
  delay: 100,
  timeout: 20000,
  maxCalls: 500,
  rpc
}

const multicallConfig = config(configData)
console.log('configData', configData, ChainId)
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.BSC]: '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c',
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  [ChainId.ETMP]: multicallConfig.rpc[ChainId.ETMP].address,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  [ChainId.ETMPTest]: multicallConfig.rpc[ChainId.ETMPTest].address
}

export { MULTICALL_ABI, MULTICALL_NETWORKS, multicallClient, ClientContract, multicallConfig, newContract }
