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
  [ChainId.GÖRLI]: {
    url: 'https://goerli.infura.io/v3/89bcfbc2c0704c4586cfecc4083c112e',
    address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696'
  },
  [ChainId.ETMP]: {
    url: 'https://rpc.etm.network/',
    address: '0xE1d731a9C7A8c599699f7E7c2d8b3e822fAABe76'
  },
  [ChainId.ETMPTest]: {
    url: 'https://rpc.pioneer.etm.network/',
    address: '0x216b7648cec721cf01cEa7a785557ae16927a56f'
  },
  [97]: {
    url: 'https://nd-695-514-258.p2pify.com/4fc4c466960bebcaa37f303c66c850ba',
    address: '0x62ec15a9D2787c73A7807d240f24170Cf10b11dA'
  }
}

const configData: Config = {
  defaultChainId: ChainId.ETMPTest,
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
