import React, { useState } from 'react'
import { BridgePage } from './styleds'
import { getWeb3Contract } from '../../utils/index'
import { useActiveWeb3React } from '../../hooks'
import BadgeAbi from '../../constants/abis/Badge.json'
import EthereumLog from '../../assets/images/ethereum-logo.png'

export default function Bridge() {
  const { library, account } = useActiveWeb3React()
  const [loading, setLoading] = useState(false)
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
              <img src={EthereumLog} alt="ethereum" />
              Ethereum chain
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
          <div>ETM3</div>
          <div>
            Balance: <strong>0 ETM3</strong>
          </div>
        </div>
        <button className="transfer-btn">Transfer</button>
      </div>
    </BridgePage>
  )
}
