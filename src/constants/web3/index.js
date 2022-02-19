import Web3 from 'web3'
import { ChainId } from '@totoroswap/sdk'
import { JsonRpcProvider } from '@ethersproject/providers'
import { cloneDeep } from 'lodash'
import { Provider, setMulticallAddress } from 'ethers-multicall-x'
import { MULTICALL_NETWORKS } from '../multicall'
import { ERC20_ABI } from '../abis/erc20'
import { useMemo, useState } from 'react'
import { useBlockNumber } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { formatAmount } from '../../utils/format'

export const getRpcUrl = chainId => {
  const RPC_URLS = {
    [ChainId.BSC]: 'https://bsc-dataseed1.ninicoin.io/'
  }
  return RPC_URLS[chainId]
}

export const getHttpWeb3 = chainId => new Web3(new Web3.providers.HttpProvider(getRpcUrl(chainId)))

export const getMultiCallProvider = (provider, chainId) => {
  for (const chainId in MULTICALL_NETWORKS) {
    setMulticallAddress(chainId, MULTICALL_NETWORKS[chainId])
  }
  return new Provider(provider, chainId)
}

export const getOnlyMultiCallProvider = (chainId = ChainId.BSC) =>
  getMultiCallProvider(new JsonRpcProvider(getRpcUrl(chainId), chainId), chainId)

export const processResult = _data => {
  const data = cloneDeep(_data)
  if (Array.isArray(data)) {
    data.map((o, i) => {
      data[i] = processResult(o)
    })
    return data
  }
  if (data.toString) {
    return data.toString()
  }
  if (typeof data === 'object') {
    for (const key in data) {
      Object.assign(data, {
        [key]: processResult(0)
      })
    }
    return data
  }
  return data
}
export const getWeb3 = library => new Web3(library.provider)
export const getWeb3Contract = (library, abi, address) => {
  const web3 = getWeb3(library)
  return new web3.eth.Contract(abi, address)
}

export const useBalance_ = (address, abi = ERC20_ABI, decimals = 18, owner = null) => {
  const [balance, setBalance] = useState('0')
  const blockNumber = useBlockNumber()
  const { account, library } = useActiveWeb3React()
  useMemo(() => {
    if (blockNumber !== 0 && account) {
      // console.log(active, address, account)
      owner = !owner ? account : owner
      const contract = getWeb3Contract(library, abi, address)
      contract.methods
        .balanceOf(owner)
        .call()
        .then(balance_ => {
          const resBalance = formatAmount(balance_, decimals)
          setBalance(resBalance)
        })
    }
  }, [blockNumber])
  return balance
}
