import { ChainId } from '@totoroswap/sdk'
import MULTICALL_ABI from './abi.json'

import {
  config,
  multicallClient,
  ChainId as ClientChainId,
  Contract as ClientContract
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
} from '@chainstarter/multicall-client.js'

ClientChainId.rinkeby = 4
ClientChainId.ETM3 = 36
ClientChainId.ETM3Test = 37
const multicallConfig = config({
  defaultChainId: ClientChainId.rinkeby,
  allowFailure: false,
  rpc: {
    [ClientChainId.rinkeby]: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      address: '0x5ba1e12693dc8f9c48aad8770482f4739beed696'
    },
    [ClientChainId.ETM3]: {
      url: 'https://rpc.etm3.com/',
      address: ''
    },
    [ClientChainId.ETM3Test]: {
      url: 'https://testnet-rpc.etm3.com',
      address: '0xA640039DE7A5f79bBE53553E86C9F5E5434E59df'
    }
  }
})

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.BSC]: '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS, ClientChainId, multicallClient, ClientContract, multicallConfig }
