import React, { useState } from 'react'
import { BridgePage, ChainListView } from './styleds'
import { getWeb3Contract } from '../../utils/index'
import { useActiveWeb3React } from '../../hooks'
import BadgeAbi from '../../constants/abis/Badge.json'
import ERC20HandlerAbi from '../../constants/abis/ERC20Handler.json'
import EthereumLog from '../../assets/images/ethereum-logo.png'
import { ClientChainId } from '../../constants/multicall'
import { ethers } from 'ethers'
import { Popover } from 'antd'
// import { Select } from 'antd'

// const { Option } = Select

const nameMap = {
  [ClientChainId.rinkeby]: {
    icon: EthereumLog,
    name: 'rinkeby chain'
  },
  [ClientChainId.ETH]: {
    icon: EthereumLog,
    name: 'Ethereum chain'
  },
  [ClientChainId.ETM3]: {
    icon: EthereumLog,
    name: 'ETM3 chain'
  },
  [ClientChainId.ETM3Test]: {
    icon: EthereumLog,
    name: 'ETM3 testchain'
  }
}

const ERC20Handler = {
  address: '0xa280EdbE2E8f29f74ec0a494D4F9bfdAb001B95A',
  abi: ERC20HandlerAbi
}
interface SupperChainIds {
  [propName: string]: number[]
}
const supperChainIds: SupperChainIds = {
  from: [ClientChainId.ETM3Test, ClientChainId.rinkeby],
  to: [ClientChainId.ETM3Test, ClientChainId.rinkeby]
}

const fromConfig = [
  {
    chainId: ClientChainId.rinkeby,
    symbol: 'ETH',
    nativos: true,
    balance: 123
  },
  {
    chainId: ClientChainId.rinkeby,
    address: '0x6DD5BeF6Ca6350368e6C5167cB71B933940dC52f',
    symbol: 'ERC20Custom',
    nativos: false,
    balance: 33
  },
  {
    chainId: ClientChainId.ETM3Test,
    nativos: true,
    balance: 441
  },
  {
    chainId: ClientChainId.ETM3Test,
    nativos: false,
    balance: 441,
    address: '0x678Fa5e07AEbf02993B3A48E8be6E5170F231b67'
  }
]
if (false) {
  console.log(fromConfig, ERC20Handler, nameMap)
}

const ddd = ethers.utils.hexZeroPad(
  '0xffffffffffffffffffffffffffffffffffffffff' + ethers.utils.hexlify(37).substr(2),
  32
)
console.log(ddd)

function ChainList({ direction, onChange }: { direction: string; onChange: Function }) {
  return (
    <ChainListView>
      {supperChainIds[direction].map((chain: number) => (
        <div key={chain} onClick={() => onChange(chain)}>
          <img src={nameMap[chain].icon} alt="" />
          <span>{nameMap[chain].name}</span>
        </div>
      ))}
    </ChainListView>
  )
}

export default function Bridge() {
  const { library, account } = useActiveWeb3React()
  const [loading, setLoading] = useState(false)
  const [fromChainId, setFromChainId] = useState<number>(ClientChainId.rinkeby)
  const [toChainId] = useState<number>(ClientChainId.ETM3Test)
  const onBadge = () => {
    console.log(loading)
    setLoading(true)
    const contract = getWeb3Contract(library, BadgeAbi, '')
    contract.methods
      .xx()
      .send({
        from: account
      })
      .on('receipt', () => {
        console.log(1)
        setLoading(false)
      })
      .on('error', () => {
        setLoading(false)
      })
  }
  return (
    <BridgePage>
      <div className="bridge-page">
        <button onClick={onBadge} style={{ display: 'none' }}>
          onBadge
        </button>
        <p>from</p>
        <div className="bridge-from">
          <div className="bridge-from-title">
            <div>
              <Popover
                placement="bottom"
                content={<ChainList direction="from" onChange={(chain: number) => setFromChainId(chain)} />}
              >
                <div className="chain-show">
                  <img src={nameMap[fromChainId].icon} alt="" />
                  {nameMap[fromChainId].name}
                </div>
              </Popover>
            </div>
            <div>
              Balance <strong>0.123 ETH</strong>
            </div>
          </div>
          <div className="bridge-from-input">
            <div>ETH</div>
            <div>
              <input type="number" placeholder="0.000" />
              <button>MAX</button>
            </div>
          </div>
        </div>
        <p>to</p>
        <div className="bridge-to">
          <div className="chain-show">
            <img src={nameMap[toChainId].icon} alt="" />
            {nameMap[toChainId].name}
          </div>
          <div>
            Balance: <strong>0 ETM3</strong>
          </div>
        </div>
        <button className="transfer-btn">Transfer</button>
      </div>
    </BridgePage>
  )
}
