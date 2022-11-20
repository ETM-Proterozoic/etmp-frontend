import React, { useMemo, useState } from 'react'
import { BridgePageView, ChainListView, TokenListView } from './styleds'
import { getWeb3Contract } from '../../utils/index'
import { useActiveWeb3React } from '../../hooks'
import BridgeAbi from '../../constants/abis/Bridge.json'
import EthereumLog from '../../assets/images/ethereum-logo.png'
import EtmpLog from '../../assets/images/ethtoken-logo.png'
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
import { ChainId } from '@etmp/sdk'
import { ADDRESS_INFINITE } from '../../constants'
import { useBlockNumber } from '../../state/application/hooks'
// import { Select } from 'antd'
// const { Option } = Select

const chainNameMap: {
  [propsName: number]: any
} = {
  [ChainId.GÖRLI]: {
    icon: EthereumLog,
    name: 'GÖRLI Chain'
  },
  [ChainId.MAINNET]: {
    icon: EthereumLog,
    name: 'Ethereum Chain'
  },
  [ChainId.ETMP]: {
    icon: EtmpLog,
    name: 'ETMP Chain'
  },
  [ChainId.ETMPTest]: {
    icon: EtmpLog,
    name: 'ETMP Testchain'
  }
}
const superChainIds: {
  [propsName: string]: number
} = {
  '1': 1,
  '4': 4,
  '5': 5,
  '48': 48,
  '49': 49
}
const getBridgeAddress = (chainId?: number) => {
  switch (chainId) {
    case ChainId.GÖRLI:
      return '0xf6298897b9Cddc1A73Ce36cdA3FFF417fA789F72'
    case ChainId.ETMPTest:
      return '0xc0b8b8Ac100940A083ea21bEDc8843Ad58bb10b2'
    case ChainId.ETMP:
      return '0x6D247f3f66866A57308d0c588079eD8f86a7e180'
    case ChainId.MAINNET:
      return '0x6367b00bB18B72Be512efeB275E0f420f2203E11'
  }
  return '0xc0b8b8Ac100940A083ea21bEDc8843Ad58bb10b2'
}

const getErc20HandlerAddress = (chainId?: number) => {
  switch (chainId) {
    case ChainId.GÖRLI:
      return '0x48f4AdDa2E9bE0d6A5a09DA1660A460682099362'
    case ChainId.ETMPTest:
      return '0x3F77eC3157fFB17986065164901135a341616B93'
    case ChainId.ETMP:
      return '0x11e7564dd419495630a4429457b49E58D5EF3831'
    case ChainId.MAINNET:
      return '0x698DB914E58d666213bCB1D9Bf835F6740affA01'
  }
  return '0x3F77eC3157fFB17986065164901135a341616B93'
}

interface SupperChainIds {
  [propName: string]: number[]
}

const DEFAULT_SUPPER_BRIDGE_CHAINIDS: SupperChainIds = {
  from: [ChainId.MAINNET, ChainId.ETMP],
  to: [ChainId.MAINNET, ChainId.ETMP]
}

const SUPPER_BRIDGE_CHAINIDS: {
  [propsName: string]: SupperChainIds
} = {
  '1': {
    from: [ChainId.MAINNET, ChainId.ETMP],
    to: [ChainId.MAINNET, ChainId.ETMP]
  },
  '48': {
    from: [ChainId.MAINNET, ChainId.ETMP],
    to: [ChainId.MAINNET, ChainId.ETMP]
  },
  '4': {
    from: [ChainId.ETMPTest, ChainId.RINKEBY],
    to: [ChainId.ETMPTest, ChainId.RINKEBY]
  },
  '5': {
    from: [ChainId.ETMPTest, ChainId.GÖRLI],
    to: [ChainId.ETMPTest, ChainId.GÖRLI]
  },
  '49': {
    from: [ChainId.ETMPTest, ChainId.GÖRLI],
    to: [ChainId.ETMPTest, ChainId.GÖRLI]
  }
}

interface FromConfig {
  [propsName: string]: any
}

const fromConfigTest: FromConfig[] = [
  {
    symbol: 'ETMP',
    chainId: ChainId.GÖRLI,
    address: '0x0819FE26Da71297d248Bd0b5033d089f7d2B01c9',
    decimals: 18,
    tokenBelong: ChainId.ETMPTest,
    correspondAddress: {
      [ChainId.ETMPTest]: {
        symbol: 'ETMP',
        address: ADDRESS_INFINITE,
        nativos: true
      }
    },
    nativos: false
  },
  {
    symbol: 'ETMP',
    chainId: ChainId.ETMPTest,
    address: ADDRESS_INFINITE,
    decimals: 18,
    tokenBelong: ChainId.ETMPTest,
    correspondAddress: {
      [ChainId.GÖRLI]: {
        symbol: 'ETMP',
        address: '0x0819FE26Da71297d248Bd0b5033d089f7d2B01c9'
      }
    },
    nativos: true
  },
  {
    symbol: 'ETH',
    chainId: ChainId.GÖRLI,
    tokenBelong: ChainId.GÖRLI,
    address: ADDRESS_INFINITE,
    decimals: 18,
    correspondAddress: {
      [ChainId.ETMPTest]: {
        symobl: 'ETH',
        address: '0x515031210f1548c1db07ea03561201391Fbcc11B'
      }
    },
    nativos: true
  },
  {
    symbol: 'ETH',
    chainId: ChainId.ETMPTest,
    address: '0x515031210f1548c1db07ea03561201391Fbcc11B',
    decimals: 18,
    tokenBelong: ChainId.GÖRLI,
    correspondAddress: {
      [ChainId.GÖRLI]: {
        symobl: 'ETH',
        nativos: true,
        address: ADDRESS_INFINITE
      }
    },
    nativos: false
  },
  {
    symbol: 'USDC',
    chainId: ChainId.GÖRLI,
    address: '0xe23eFB40beB2a18B7c6a94889C46fCD9BCA1B0b0',
    decimals: 6,
    tokenBelong: ChainId.GÖRLI,
    correspondAddress: {
      [ChainId.ETMPTest]: {
        symbol: 'USDC',
        address: '0x0F55b4b18EBF723DC2c37aFAfBe20847f2dDA4bC'
      }
    },
    nativos: false
  },
  {
    symbol: 'USDC',
    chainId: ChainId.ETMPTest,
    address: '0x0F55b4b18EBF723DC2c37aFAfBe20847f2dDA4bC',
    decimals: 6,
    tokenBelong: ChainId.GÖRLI,
    correspondAddress: {
      [ChainId.GÖRLI]: {
        symbol: 'USDC',
        address: '0xe23eFB40beB2a18B7c6a94889C46fCD9BCA1B0b0'
      }
    },
    nativos: false
  },
  {
    symbol: 'USDT',
    chainId: ChainId.GÖRLI,
    address: '0xB1b4A3a3118f42F9e9A5AA8ccf7D1B1E062D93c8',
    decimals: 6,
    tokenBelong: ChainId.GÖRLI,
    correspondAddress: {
      [ChainId.ETMPTest]: {
        symbol: 'USDT',
        address: '0x2A823bd1842Ad6785b606B304062278B9b82c937'
      }
    },
    nativos: false
  },
  {
    symbol: 'USDT',
    chainId: ChainId.ETMPTest,
    address: '0x2A823bd1842Ad6785b606B304062278B9b82c937',
    decimals: 6,
    tokenBelong: ChainId.GÖRLI,
    correspondAddress: {
      [ChainId.GÖRLI]: {
        symbol: 'USDT',
        address: '0xB1b4A3a3118f42F9e9A5AA8ccf7D1B1E062D93c8'
      }
    },
    nativos: false
  },
  {
    symbol: 'WBTC',
    chainId: ChainId.GÖRLI,
    address: '0xf61A3a66849caa3C2A77875205828CA21f2972ce',
    decimals: 8,
    tokenBelong: ChainId.GÖRLI,
    correspondAddress: {
      [ChainId.ETMPTest]: {
        symbol: 'WBTC',
        address: '0x9e476B8E62B807dB1ac7036CaBe81E465CF41a3f'
      }
    },
    nativos: false
  },
  {
    symbol: 'WBTC',
    chainId: ChainId.ETMPTest,
    address: '0x9e476B8E62B807dB1ac7036CaBe81E465CF41a3f',
    decimals: 8,
    tokenBelong: ChainId.GÖRLI,
    correspondAddress: {
      [ChainId.GÖRLI]: {
        symbol: 'WBTC',
        address: '0xf61A3a66849caa3C2A77875205828CA21f2972ce'
      }
    },
    nativos: false
  }
]

const fromConfigMain: FromConfig[] = [
  {
    symbol: 'ETMP',
    chainId: ChainId.MAINNET,
    address: '0x584E118C3E75873965D1152153A9f1e7733ab022',
    decimals: 18,
    tokenBelong: ChainId.ETMP,
    correspondAddress: {
      [ChainId.ETMP]: {
        symbol: 'ETMP',
        address: ADDRESS_INFINITE,
        nativos: true
      }
    },
    nativos: false
  },
  {
    symbol: 'ETMP',
    chainId: ChainId.ETMP,
    address: ADDRESS_INFINITE,
    decimals: 18,
    tokenBelong: ChainId.ETMP,
    correspondAddress: {
      [ChainId.ETMP]: {
        symbol: 'ETMP',
        address: '0x584E118C3E75873965D1152153A9f1e7733ab022'
      }
    },
    nativos: true
  },
  {
    symbol: 'ETH',
    chainId: ChainId.MAINNET,
    tokenBelong: ChainId.MAINNET,
    address: ADDRESS_INFINITE,
    decimals: 18,
    correspondAddress: {
      [ChainId.MAINNET]: {
        symobl: 'ETH',
        address: '0x98a53d0b5529B9488a5E993755465d67340Ea7bd'
      }
    },
    nativos: true
  },
  {
    symbol: 'ETH',
    chainId: ChainId.ETMP,
    address: '0x98a53d0b5529B9488a5E993755465d67340Ea7bd',
    decimals: 18,
    tokenBelong: ChainId.MAINNET,
    correspondAddress: {
      [ChainId.MAINNET]: {
        symobl: 'ETH',
        nativos: true,
        address: ADDRESS_INFINITE
      }
    },
    nativos: false
  },
  {
    symbol: 'USDC',
    chainId: ChainId.MAINNET,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    tokenBelong: ChainId.MAINNET,
    correspondAddress: {
      [ChainId.ETMP]: {
        symbol: 'USDC',
        address: '0xb19B65eaAFCA749763A2ce9312944fb208Ca1ad1'
      }
    },
    nativos: false
  },
  {
    symbol: 'USDC',
    chainId: ChainId.ETMP,
    address: '0xb19B65eaAFCA749763A2ce9312944fb208Ca1ad1',
    decimals: 6,
    tokenBelong: ChainId.MAINNET,
    correspondAddress: {
      [ChainId.MAINNET]: {
        symbol: 'USDC',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
      }
    },
    nativos: false
  },
  {
    symbol: 'USDT',
    chainId: ChainId.MAINNET,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    tokenBelong: ChainId.MAINNET,
    correspondAddress: {
      [ChainId.ETMP]: {
        symbol: 'USDT',
        address: '0x82b1BE1D0cC4F70fC530D5BE9f8C5e08ae0E5066'
      }
    },
    nativos: false
  },
  {
    symbol: 'USDT',
    chainId: ChainId.ETMP,
    address: '0x82b1BE1D0cC4F70fC530D5BE9f8C5e08ae0E5066',
    decimals: 6,
    tokenBelong: ChainId.MAINNET,
    correspondAddress: {
      [ChainId.MAINNET]: {
        symbol: 'USDT',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      }
    },
    nativos: false
  }
]

const getBridgeTokenConfig = (chainId: number) => {
  switch (chainId) {
    case ChainId.GÖRLI:
      return fromConfigTest
    case ChainId.ETMPTest:
      return fromConfigTest
    case ChainId.ETMP:
    case ChainId.MAINNET:
      return fromConfigMain
    default:
      return fromConfigMain
  }
}

const fromConfigMap = [...fromConfigTest, ...fromConfigMain].reduce((map: { [propName: string]: any }, item) => {
  map[`${item.chainId}_${item.address}`] = item
  return map
}, {})

function FromChainList({
  direction,
  onChange,
  bridgeChainIds
}: {
  direction: string
  onChange: Function
  bridgeChainIds: SupperChainIds
}) {
  return (
    <ChainListView>
      {bridgeChainIds[direction].map((chain: number) => (
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
  onChange,
  bridgeChainIds
}: {
  fromChainId: number
  fromToken: string
  onChange: Function
  bridgeChainIds: SupperChainIds
}) {
  return (
    <ChainListView>
      {bridgeChainIds.to.map((chain: number) => {
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

function FromTokenList({
  chainId,
  onChange,
  fromConfig
}: {
  chainId: number
  onChange: Function
  fromConfig: FromConfig
}) {
  return (
    <TokenListView>
      {fromConfig.map((item: any, index: number) => {
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
  const { library, chainId, account } = useActiveWeb3React()
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const callChainId = useMemo(() => superChainIds[chainId] || ChainId.ETMP, [chainId])
  const fromConfig = useMemo(() => getBridgeTokenConfig(callChainId), [callChainId])
  const bridgeChainIds = SUPPER_BRIDGE_CHAINIDS[callChainId] || DEFAULT_SUPPER_BRIDGE_CHAINIDS
  const [loading, setLoading] = useState(false)
  const [fromChainId, setFromChainId] = useState<number>(callChainId)
  const [toChainId, setToChainId] = useState<number>(0)
  const [fromToken, setFromToken] = useState<string>(ADDRESS_INFINITE)
  const [depositAmount, setDepositAmount] = useState<string | number>('')
  const [balanceMap, setBalanceMap] = useState<{ [propsName: string]: string | number }>({})
  const [approveMap, setApproveMap] = useState<{ [propsName: string]: boolean }>({})
  const blockNumber = useBlockNumber()
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
          multicallClient([contract.allowance(account, getErc20HandlerAddress(fromConfig[i].chainId))]).then(
            (res: string[]) => res[0]
          )
        )
      }
    }
    Promise.all(promiseList).then(res => {
      const balancesMap_: { [propName: string]: any } = {}
      const approveMap_: { [propName: string]: any } = {}
      for (let i = 0, j = 0; i < fromConfig.length; i++, j++) {
        const key = `${fromConfig[i].chainId}_${fromConfig[i].address}`
        balancesMap_[key] = Number(fromWei(res[j], fromConfig[i].decimals).toFixed(4)) || 0
        if (fromConfig[i].nativos) {
          approveMap_[key] = true
        } else {
          approveMap_[key] = res[j + 1] > 0
          j++
        }
      }
      setBalanceMap(balancesMap_)
      setApproveMap(approveMap_)
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

    const tokenBelong = fromConfigMap[`${fromChainId}_${fromToken}`].tokenBelong
    const resourceAddress = involveNativos
      ? ADDRESS_INFINITE
      : tokenBelong !== fromChainId
      ? fromConfigMap[`${fromChainId}_${fromToken}`].correspondAddress[toChainId].address
      : fromToken

    console.log("resourceAddress: ", resourceAddress, "; tokenBelong: ", tokenBelong)
    const resourceId = ethers.utils.hexZeroPad(resourceAddress + ethers.utils.hexlify(tokenBelong).substr(2), 32)
    const amount = numToWei(depositAmount, fromConfigMap[`${fromChainId}_${fromToken}`].decimals).toString()
    const data =
      '0x' +
      ethers.utils.hexZeroPad(Web3.utils.numberToHex(amount), 32).substr(2) + // Deposit Amount (32 bytes)
      ethers.utils.hexZeroPad(ethers.utils.hexlify((account.length - 2) / 2), 32).substr(2) + // len(recipientAddress) (32 bytes)
      account.substr(2)

    const contract = getWeb3Contract(library, BridgeAbi, getBridgeAddress(chainId))
    console.log('toChainId', toChainId, 'resourceId', resourceId, 'data', data)
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
      .approve(getErc20HandlerAddress(chainId), ADDRESS_INFINITE)
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
    const fromTokenItem = fromConfig.find(item => item.chainId === fromChainId)
    setFromToken(fromTokenItem?.address)
  }, [fromChainId])
  useMemo(() => {
    if (account) {
      getTokenInfo()
    }
  }, [account, blockNumber, callChainId])
  return (
    <BridgePageView>
      <div className="bridge-page">
        <p>From</p>
        <div className="bridge-from">
          <div className="bridge-from-title">
            <div>
              <Popover
                placement="bottom"
                content={
                  <FromChainList
                    direction="from"
                    onChange={(chain: number) => setFromChainId(chain)}
                    bridgeChainIds={bridgeChainIds}
                  />
                }
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
                {balanceMap[`${fromChainId}_${fromToken}`] ?? '-'}{' '}
                {fromConfigMap[`${fromChainId}_${fromToken}`]?.symbol}
              </strong>
            </div>
          </div>
          <div className="bridge-from-input">
            <div>
              <Popover
                placement="bottom"
                content={
                  <FromTokenList
                    chainId={fromChainId}
                    onChange={(token: string) => setFromToken(token)}
                    fromConfig={fromConfig}
                  />
                }
              >
                <span style={{ cursor: 'pointer' }}>{fromConfigMap[`${fromChainId}_${fromToken}`]?.symbol}</span>
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
                bridgeChainIds={bridgeChainIds}
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
          <div>{/*Balance: <strong>0 ETMP</strong>*/}</div>
        </div>
        {fromChainId !== chainId ? (
          <Button className="transfer-btn" onClick={() => changeNetwork(fromChainId)}>
            switch to {chainNameMap[fromChainId].name}
          </Button>
        ) : !approveMap[`${fromChainId}_${fromToken}`] && !fromConfigMap[`${fromChainId}_${fromToken}`]?.nativos ? (
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
