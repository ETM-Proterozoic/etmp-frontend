import React, { useMemo, useState } from 'react'
import { BridgePageView, ChainListView, TokenListView } from './styleds'
import { getWeb3Contract } from '../../utils/index'
import { useActiveWeb3React } from '../../hooks'
import BridgeAbi from '../../constants/abis/Bridge.json'
import EthereumLog from '../../assets/images/ethereum-logo.png'
import { multicallClient, newContract } from '../../constants/multicall'
import { ethers } from 'ethers'
import { Button, Popover } from 'antd'
import { fromWei, numToWei } from '../../utils/format'
import Web3 from 'web3'
import { ERC20_ABI } from '../../constants/abis/erc20'
import ArrowDown from '../../assets/svg/arrow_down2.svg'
import ArrowDownDark from '../../assets/svg/arrow_down2_dark.svg'
import { useDarkModeManager } from '../../state/user/hooks'
import { changeNetwork } from '../../utils/connectWall'
import { ADDRESS_INFINITE } from '../../constants'
import { ChainId } from '@etm3/sdk'
// import { Select } from 'antd'

// const { Option } = Select

const chainNameMap: {
  [propsName: number]: any
} = {
  [ChainId.RINKEBY]: {
    icon: EthereumLog,
    name: 'RINKEBY Chain'
  },
  [ChainId.MAINNET]: {
    icon: EthereumLog,
    name: 'Ethereum Chain'
  },
  [ChainId.ETM3]: {
    icon: EthereumLog,
    name: 'ETM Chain'
  },
  [ChainId.ETM3Test]: {
    icon: EthereumLog,
    name: 'ETM Testchain'
  }
}

const Bridge = {
  address: '0x6d4989D1ed6D519aabAE2103060cDeE0fD6Fe30F',
  abi: BridgeAbi
}

const ERC20_HANDLER_ADDRESS = '0xa280EdbE2E8f29f74ec0a494D4F9bfdAb001B95A'

interface SupperChainIds {
  [propName: string]: number[]
}
const supperChainIds: SupperChainIds = {
  from: [ChainId.ETM3Test, ChainId.RINKEBY],
  to: [ChainId.ETM3Test, ChainId.RINKEBY]
}

interface FromConfig {
  [propsName: string]: any
}

const fromConfig: FromConfig[] = [
  {
    symbol: 'ETH',
    chainId: ChainId.RINKEBY,
    nativos: true,
    tokenBelong: ChainId.RINKEBY,
    address: '0xffffffffffffffffffffffffffffffffffffffff',
    decimals: 18,
    correspondAddress: {
      [ChainId.ETM3Test]: {
        symobl: 'WETH',
        address: '0x678Fa5e07AEbf02993B3A48E8be6E5170F231b67'
      }
    }
  },
  {
    symbol: 'WETH',
    chainId: ChainId.ETM3Test,
    nativos: false,
    address: '0x678Fa5e07AEbf02993B3A48E8be6E5170F231b67',
    decimals: 18,
    tokenBelong: ChainId.RINKEBY,
    correspondAddress: {
      [ChainId.RINKEBY]: {
        symobl: 'ETM',
        nativos: true,
        address: '0xffffffffffffffffffffffffffffffffffffffff'
      }
    }
  },
  {
    symbol: 'ETM',
    chainId: ChainId.ETM3Test,
    address: '0xffffffffffffffffffffffffffffffffffffffff',
    decimals: 18,
    nativos: true,
    tokenBelong: ChainId.ETM3Test,
    correspondAddress: {
      [ChainId.RINKEBY]: {
        symbol: 'WETM',
        address: '0x678Fa5e07AEbf02993B3A48E8be6E5170F231b67'
      }
    }
  },
  {
    symbol: 'WETM',
    chainId: ChainId.RINKEBY,
    address: '0x678Fa5e07AEbf02993B3A48E8be6E5170F231b67',
    decimals: 18,
    nativos: false,
    tokenBelong: ChainId.ETM3Test,
    correspondAddress: {
      [ChainId.ETM3Test]: {
        symbol: 'ETM3',
        nativos: true,
        address: '0xffffffffffffffffffffffffffffffffffffffff'
      }
    }
  },
  {
    symbol: 'ERC20Custom',
    chainId: ChainId.RINKEBY,
    address: '0x6DD5BeF6Ca6350368e6C5167cB71B933940dC52f',
    decimals: 18,
    tokenBelong: ChainId.ETM3Test,
    correspondAddress: {
      [ChainId.ETM3Test]: {
        symbol: 'ERC20Custom',
        address: '0x6DD5BeF6Ca6350368e6C5167cB71B933940dC52f'
      }
    },
    nativos: false
  },
  {
    symbol: 'ERC20Custom',
    chainId: ChainId.ETM3Test,
    address: '0x6DD5BeF6Ca6350368e6C5167cB71B933940dC52f',
    decimals: 18,
    tokenBelong: ChainId.ETM3Test,
    correspondAddress: {
      [ChainId.RINKEBY]: {
        symbol: 'ERC20Custom',
        address: '0x6DD5BeF6Ca6350368e6C5167cB71B933940dC52f'
      }
    },
    nativos: false
  }
]

const fromConfigMap = fromConfig.reduce((map: { [propName: string]: any }, item) => {
  map[`${item.chainId}_${item.address}`] = item
  return map
}, {})

function FromChainList({ direction, onChange }: { direction: string; onChange: Function }) {
  return (
    <ChainListView>
      {supperChainIds[direction].map((chain: number) => (
        <div key={chain} onClick={() => onChange(chain)}>
          <img src={chainNameMap[chain].icon} alt="" />
          <span>{chainNameMap[chain].name}</span>
        </div>
      ))}
    </ChainListView>
  )
}

function ToChainList({
  fromChainId,
  fromToken,
  onChange
}: {
  fromChainId: number
  fromToken: string
  onChange: Function
}) {
  return (
    <ChainListView>
      {supperChainIds.to.map((chain: number) => {
        if (fromConfigMap[`${fromChainId}_${fromToken}`].correspondAddress[chain]) {
          return (
            <div key={chain} onClick={() => onChange(chain)}>
              <img src={chainNameMap[chain].icon} alt="" />
              <span>{chainNameMap[chain].name}</span>
            </div>
          )
        }
        return null
      })}
    </ChainListView>
  )
}

function FromTokenList({ chainId, onChange }: { chainId: number; onChange: Function }) {
  return (
    <TokenListView>
      {fromConfig.map((item, index) => {
        if (item.chainId === chainId) {
          return (
            <div key={index} onClick={() => onChange(item.address)}>
              <span>{item.symbol}</span>
            </div>
          )
        }
        return null
      })}
    </TokenListView>
  )
}

export default function BridgePage() {
  const [isDark] = useDarkModeManager()
  const { library, account, chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState(false)
  const [fromChainId, setFromChainId] = useState<number>(chainId || ChainId.MAINNET)
  const [toChainId, setToChainId] = useState<number>(0)
  const [fromToken, setFromToken] = useState<string>('0xffffffffffffffffffffffffffffffffffffffff')
  const [depositAmount, setDepositAmount] = useState<string | number>('')
  const [balanceMap, setBalanceMap] = useState<{ [propsName: string]: string | number }>({})
  const [approveMap, setApproveMap] = useState<{ [propsName: string]: boolean }>({})
  const getTokenInfo = () => {
    const promiseList = []
    for (let i = 0; i < fromConfig.length; i++) {
      if (fromConfig[i].nativos) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        promiseList.push(multicallClient.getEthBalance(account, fromConfig[i].chainId))
      } else {
        const contract = newContract(ERC20_ABI, fromConfig[i].address, fromConfig[i].chainId)
        promiseList.push(multicallClient([contract.balanceOf(account)]).then((res: string[]) => res[0]))
        promiseList.push(
          multicallClient([contract.allowance(account, ERC20_HANDLER_ADDRESS)]).then((res: string[]) => res[0])
        )
      }
    }
    Promise.all(promiseList).then(res => {
      const balancesMap_: { [propName: string]: any } = {}
      const approveMap_: { [propName: string]: any } = {}
      for (let i = 0, j = 0; i < fromConfig.length; i++, j++) {
        const key = `${fromConfig[i].chainId}_${fromConfig[i].address}`
        balancesMap_[key] = Number(fromWei(res[j], fromConfig[i].decimals).toFixed(4))
        if (fromConfig[i].nativos) {
          approveMap_[key] = true
        } else {
          approveMap_[key] = res[j + 1] > 0
          j++
        }
      }
      setBalanceMap(balancesMap_)
      setApproveMap(approveMap_)
      console.log(res)
    })
  }
  const onBadge = () => {
    if (!account || !depositAmount || Number(depositAmount) <= 0 || toChainId === 0) {
      return
    }
    setLoading(true)
    const involveNativos =
      fromConfigMap[`${fromChainId}_${fromToken}`].nativos ||
      fromConfigMap[`${fromChainId}_${fromToken}`].correspondAddress[toChainId]?.nativos

    const resourceAddress = involveNativos ? ADDRESS_INFINITE : fromToken
    const tokenBelong = fromConfigMap[`${fromChainId}_${fromToken}`].tokenBelong
    const resourceId = ethers.utils.hexZeroPad(resourceAddress + ethers.utils.hexlify(tokenBelong).substr(2), 32)
    const amount = numToWei(depositAmount, fromConfigMap[`${fromChainId}_${fromToken}`].decimals).toString()
    const data =
      '0x' +
      ethers.utils.hexZeroPad(Web3.utils.numberToHex(amount), 32).substr(2) + // Deposit Amount (32 bytes)
      ethers.utils.hexZeroPad(ethers.utils.hexlify((account.length - 2) / 2), 32).substr(2) + // len(recipientAddress) (32 bytes)
      account.substr(2)

    console.log(toChainId, resourceId, data, amount)
    const contract = getWeb3Contract(library, Bridge.abi, Bridge.address)
    contract.methods
      .deposit(toChainId, resourceId, data)
      .send({
        from: account,
        value: fromConfigMap[`${fromChainId}_${fromToken}`].nativos ? amount : 0
      })
      .on('receipt', () => {
        getTokenInfo()
        setDepositAmount('')
        setLoading(false)
      })
      .on('error', () => {
        setLoading(false)
      })
  }
  const onApprove = () => {
    setLoading(true)
    const contract = getWeb3Contract(library, ERC20_ABI, fromConfigMap[`${fromChainId}_${fromToken}`].address)
    contract.methods
      .approve(ERC20_HANDLER_ADDRESS, ADDRESS_INFINITE)
      .send({
        from: account
      })
      .on('receipt', () => {
        getTokenInfo()
        setLoading(false)
      })
      .on('error', () => {
        setLoading(false)
      })
  }
  const onMax = () => {
    if (balanceMap[`${fromChainId}_${fromToken}`] > 0) {
      const maxAmount = Number(balanceMap[`${fromChainId}_${fromToken}`]) || 0
      if (fromConfigMap[`${fromChainId}_${fromToken}`].nativos) {
        setDepositAmount(Math.max(maxAmount - 0.1, 0))
      } else {
        setDepositAmount(maxAmount)
      }
    }
  }
  useMemo(() => {
    if (fromChainId === toChainId) {
      setToChainId(0)
    }
  }, [fromChainId])
  useMemo(() => {
    if (account) {
      getTokenInfo()
    }
  }, [account])
  return (
    <BridgePageView>
      <div className="bridge-page">
        <p>From</p>
        <div className="bridge-from">
          <div className="bridge-from-title">
            <div>
              <Popover
                placement="bottom"
                content={<FromChainList direction="from" onChange={(chain: number) => setFromChainId(chain)} />}
              >
                <div className="chain-show">
                  <img src={chainNameMap[fromChainId].icon} alt="" />
                  {chainNameMap[fromChainId].name}
                </div>
              </Popover>
            </div>
            <div>
              Balance{' '}
              <strong>
                {balanceMap[`${fromChainId}_${fromToken}`] ?? '-'} {fromConfigMap[`${fromChainId}_${fromToken}`].symbol}
              </strong>
            </div>
          </div>
          <div className="bridge-from-input">
            <div>
              <Popover
                placement="bottom"
                content={<FromTokenList chainId={fromChainId} onChange={(token: string) => setFromToken(token)} />}
              >
                <span style={{ cursor: 'pointer' }}>{fromConfigMap[`${fromChainId}_${fromToken}`].symbol}</span>
              </Popover>
            </div>
            <div>
              <div>
                <input
                  type="number"
                  placeholder="0.000"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.currentTarget.value)}
                />
              </div>

              <button style={{ cursor: 'pointer' }} onClick={onMax}>
                MAX
              </button>
            </div>
          </div>
        </div>
        <p>To</p>
        <div className="bridge-to">
          <Popover
            placement="bottom"
            content={
              <ToChainList
                fromChainId={fromChainId}
                fromToken={fromToken}
                onChange={(chain: number) => setToChainId(chain)}
              />
            }
          >
            <div className="chain-show">
              {!chainNameMap[toChainId] ? (
                <>
                  select a chain <img src={isDark ? ArrowDownDark : ArrowDown} className="chain-show-arrow" alt="" />
                </>
              ) : (
                <>
                  <img src={chainNameMap[toChainId].icon} alt="" />
                  {chainNameMap[toChainId].name}
                </>
              )}
            </div>
          </Popover>
          <div>{/*Balance: <strong>0 ETM3</strong>*/}</div>
        </div>
        {fromChainId !== chainId ? (
          <Button className="transfer-btn" onClick={() => changeNetwork(fromChainId)}>
            switch to {chainNameMap[fromChainId].name}
          </Button>
        ) : !approveMap[`${fromChainId}_${fromToken}`] && !fromConfigMap[`${fromChainId}_${fromToken}`].nativos ? (
          <Button loading={loading} className="transfer-btn" onClick={onApprove}>
            Approve
          </Button>
        ) : (
          <Button loading={loading} className="transfer-btn" onClick={onBadge}>
            Transfer
          </Button>
        )}
      </div>
    </BridgePageView>
  )
}
