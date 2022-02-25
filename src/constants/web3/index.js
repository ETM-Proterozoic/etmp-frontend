import Web3 from 'web3'
import { ChainId } from '@totoroswap/sdk'
import { ERC20_ABI } from '../abis/erc20'
import { useMemo, useState } from 'react'
import { useBlockNumber } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { formatAmount } from '../../utils/format'
import { ClientChainId, multicallConfig } from '../multicall'

export const getRpcUrl = chainId => {
  const RPC_URLS = {
    [ChainId.BSC]: 'https://bsc-dataseed1.ninicoin.io/',
    [ClientChainId.ETM3]: multicallConfig.rpc[ClientChainId.ETM3].url
  }
  return RPC_URLS[chainId]
}

export const getHttpWeb3 = chainId => new Web3(new Web3.providers.HttpProvider(getRpcUrl(chainId)))

export const getWeb3 = library => new Web3(library.provider)
export const getWeb3Contract = (library, abi, address) => {
  const web3 = getWeb3(library)
  return new web3.eth.Contract(abi, address)
}

export const useBalance = (address, abi = ERC20_ABI, decimals = 18, owner = null) => {
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
