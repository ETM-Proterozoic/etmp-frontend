import React, { useMemo, useState } from 'react'
import { StakingPage } from './style'
import InfoIcon from '../../assets/svg/staking/info-icon.svg'
import BannerBg from '../../assets/svg/staking/banner-bg.png'
import PageBG from '../../assets/svg/staking/bg.png'
// import ArrowR from '../../assets/svg/staking/arrow-right.svg'
import MoreSvg from '../../assets/svg/staking/more.svg'
import { ClientContract, multicallClient, multicallConfig } from '../../constants/multicall/index'
import { useActiveWeb3React } from '../../hooks'
import StakingAbi from '../../constants/abis/Staking.json'
import DPOSAbi from '../../constants/abis/DPOS.json'
import DposMineAbi from '../../constants/abis/DposMine.json'
import { formatAddress, fromWei, numToWei, toFormat } from '../../utils/format'
import { getWeb3Contract } from '../../utils'
import { Input, message, Modal, Tooltip } from 'antd'

const ADDRESS_INFINITE = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'
const ADDRESS_0 = '0x0000000000000000000000000000000000000000'

const Staking = {
  address: '0x230761E165EC7f6A46B42CCba786bFC0856F4C41',
  abi: StakingAbi
}
const DPosMine = {
  address: '0xE5Ee286F8772d3f0BC170725890a31E3BE387c0A',
  abi: DposMineAbi
}
const DPOS = {
  address: '0x4277283479c9b7F65b72f9138638780B1cB9f32C',
  abi: DPOSAbi
}

const stakingContract = new ClientContract(Staking.abi, Staking.address, multicallConfig.defaultChainId)
const dposContract = new ClientContract(DPOS.abi, DPOS.address, multicallConfig.defaultChainId)
const dposMineContract = new ClientContract(DPosMine.abi, DPosMine.address, multicallConfig.defaultChainId)
interface ValidatorsData {
  address: string
  logo: string
  totalSupply: string
  myStaked: string
  apy: string
  myEarned: string
  apr: string
}
interface StakingWithoutDelegate {
  apy: string
  apr: string
  staked: string
  rewards: string
  staked_: string
  rewards_: string
}
interface TotalSupply {
  totalSupply: string
  totalReward: string
}

export default function StakingView() {
  const { account, library } = useActiveWeb3React()
  const [blockNumber, setBlockNumber] = useState<string>('')
  const [validatorsData, setValidatorsData] = useState<ValidatorsData[]>([])
  const [compoundLoading, setCompoundLoading] = useState<boolean>(false)
  // const [claimLoading, setClaimLoading] = useState<boolean>(false)
  const [stakeLoading, setStakeLoading] = useState<boolean>(false)
  const [showStake, setShowStake] = useState<boolean>(false)
  const [stakeValue, setStakeValue] = useState<string>('')
  const [stakeDelegate, setStakeDelegate] = useState<string | null>(null)
  const [totalData, setTotalData] = useState<TotalSupply>({
    totalSupply: '',
    totalReward: ''
  })
  const [stakingWithoutDelegate, setStakingWithoutDelegate] = useState<StakingWithoutDelegate>({
    apy: '-',
    apr: '-',
    staked: '0',
    staked_: '0',
    rewards: '0',
    rewards_: '0'
  })

  const calcMyStaking = () => {
    let myAllStaking = 0
    let myAllRewards = 0
    for (let i = 0; i < validatorsData.length; i++) {
      myAllStaking = myAllStaking + Number(validatorsData[i].myStaked)
      myAllRewards = myAllRewards + Number(validatorsData[i].myEarned)
    }
    myAllStaking = myAllStaking + Number(stakingWithoutDelegate.staked)
    myAllRewards = myAllRewards + Number(stakingWithoutDelegate.rewards)
    return { myAllStaking, myAllRewards }
  }

  const { myAllStaking, myAllRewards } = calcMyStaking()

  const getStakingWithoutDelegate = () => {
    const calls = [
      dposContract.earned(ADDRESS_INFINITE, account),
      dposContract.APR(ADDRESS_INFINITE),
      dposContract.balanceOf(ADDRESS_INFINITE, account)
    ]
    multicallClient(calls).then((res: any) => {
      console.log(res)
      const apr = fromWei(res[1]).toNumber()
      const apy = (Math.pow(1 + apr, 365) * 100).toFixed(2)
      const rewards = fromWei(res[0]).toFixed(2)
      const staked = fromWei(res[2]).toFixed(2)
      setStakingWithoutDelegate({
        apy,
        apr: (apr * 100).toFixed(2),
        staked,
        rewards,
        staked_: res[0],
        rewards_: res[2]
      })
    })
  }

  const getValidators = () => {
    const calls = [
      stakingContract.validators(),
      dposContract.totalSupply(),
      dposMineContract.balanceOf(ADDRESS_INFINITE)
    ]
    multicallClient(calls).then(async (res: any) => {
      console.log('getValidators', res)
      const validators_ = res[0]
      setTotalData({
        totalSupply: fromWei(res[1], 18).toFixed(0),
        totalReward: fromWei(res[2], 18).toFixed(0)
      })
      const validators: ValidatorsData[] = []
      const validatorsCallList = []
      for (let i = 0; i < validators_.length; i++) {
        validatorsCallList.push(dposContract.APR(validators_[i]), dposContract.totalSupplyOf(validators_[i]))
        if (account) {
          validatorsCallList.push(dposContract.balanceOf(validators_[i], account))
          validatorsCallList.push(dposContract.earned(validators_[i], account))
        }
      }

      multicallClient(validatorsCallList).then((res2: string[]) => {
        console.log('res2', res2)
        for (let i = 0, ii = 0; i < validators_.length; i++) {
          const address = validators_[i]
          const apr = fromWei(res2[ii]).toNumber()
          const apy = (Math.pow(1 + apr, 365) * 100).toFixed(2)
          const totalSupply = fromWei(res2[ii + 1], 18).toFixed(0)
          let myStaked = '0'
          let myEarned = '0'
          if (account) {
            myStaked = fromWei(res2[ii + 2]).toFixed(2)
            myEarned = fromWei(res2[ii + 3]).toFixed(2)
            ii += 3
          } else {
            ii += 1
          }
          validators.push({
            address,
            logo: `https://avatars.dicebear.com/api/bottts/${address}.svg`,
            totalSupply,
            myStaked,
            myEarned,
            apy,
            apr: (apr * 100).toFixed(2)
          })
        }
        console.log(validators)
        setValidatorsData(validators)
      })
    })
  }
  const getBlockHeight = () => {
    multicallClient.getBlockInfo(multicallConfig.defaultChainId).then((res: any) => {
      setBlockNumber(res.number)
    })
  }
  const onCompoundAll = () => {
    if (compoundLoading) {
      return
    }
    setCompoundLoading(true)
    const contract = getWeb3Contract(library, DPOS.abi, DPOS.address)
    contract.methods
      .compoundAll(ADDRESS_INFINITE)
      .send({
        from: account
      })
      .on('receipt', () => {
        setCompoundLoading(false)
      })
      .on('error', () => {
        setCompoundLoading(false)
      })
  }
  const onStake = () => {
    if (stakeLoading || !stakeValue || Number(stakeValue) <= 0) {
      return
    }
    setStakeLoading(true)
    const contract = getWeb3Contract(library, DPOS.abi, DPOS.address)
    const stakeValue_ = numToWei(stakeValue, 18)
    contract.methods
      .stake(stakeDelegate)
      .send({
        from: account,
        value: stakeValue_
      })
      .on('receipt', () => {
        setStakeLoading(false)
      })
      .on('error', () => {
        setStakeLoading(false)
      })
  }
  const withdraw = (delegate: string, value: string) => {
    if (Number(value) < 0) {
      return
    }
    const contract = getWeb3Contract(library, DPOS.abi, DPOS.address)
    contract.methods
      .withdraw(delegate, value)
      .send({
        from: account
      })
      .on('receipt', () => {
        message.success('Unstake & Claim success')
      })
      .on('error', () => {
        message.error('Unstake & Claim fail')
      })
  }
  useMemo(() => {
    getBlockHeight()
  }, [])
  useMemo(() => {
    getValidators()
    if (account) {
      getStakingWithoutDelegate()
    }
  }, [account])
  return (
    <StakingPage bg={PageBG}>
      <div className="staking-page">
        <div className="banner">
          <div>
            <h1>Start Earning rewards with</h1>
            <h1>
              ETM<span>3</span> Staking.
            </h1>
            <p>
              {/*<button className="banner-btn">*/}
              {/*  Become a Delegator{' '}*/}
              {/*  <span>*/}
              {/*    <img src={ArrowR} alt="" />*/}
              {/*  </span>*/}
              {/*</button>*/}
            </p>
          </div>
          <div className="banner-bg">
            <img src={BannerBg} alt="" />
          </div>
        </div>
        <div className="network-overview card">
          <div className="card-title">
            <span>Network Overview</span>
          </div>
          <div className="card-main">
            <div className="card-main-item">
              <p className="card-main-title">TOTAL VALIDATORS</p>
              <h1>{validatorsData.length}</h1>
              <p className="card-desc"> </p>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">TOTAL STAKE</p>
              <h1>{totalData.totalSupply ? toFormat(totalData.totalSupply) : '-'} ETM</h1>
              {/*<p className="card-desc">$</p>*/}
            </div>
            <div className="card-main-item">
              <p className="card-main-title">TOTAL REWARD DISTRIBUTED</p>
              <h1>{totalData.totalReward ? toFormat(totalData.totalReward) : '-'} ETM</h1>
              {/*<p className="card-desc">$</p>*/}
            </div>
            <div className="card-main-item">
              <p className="card-main-title">BOR BLOCK HEIGHT</p>
              <h1>{blockNumber ? toFormat(blockNumber) : '-'}</h1>
              <p className="card-desc"> </p>
            </div>
          </div>
        </div>
        <div className="account-data card">
          <div className="card-title">
            <span>My Account</span>
          </div>
          <div className="card-main">
            <div className="card-main-item">
              <p className="card-main-title">
                BALANCE{' '}
                <Tooltip title="The balance of your account, Including the address balance and the amount of staking.">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1> ETM</h1>
              {/*<p className="card-desc">$125670</p>*/}
            </div>
            <div className="card-main-item">
              <p className="card-main-title">
                STAKING
                <Tooltip title="Including your staking and delegate staking.">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1>{myAllStaking} ETM</h1>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">
                REWARDS{' '}
                <Tooltip title="The rewards include staking rewards and validators node gas fee rewards.">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1>{myAllRewards} ETM</h1>
              <p className="card-desc"> </p>
            </div>
            <div className="card-main-item-btns">
              <div className="btn-compound" onClick={onCompoundAll}>
                Compound
              </div>
              {/*<div className="btn-claim">Claim</div>*/}
            </div>
          </div>
        </div>
        <div className="staking-without-delegate card">
          <div className="card-title">
            <span>Staking Without Delegate</span>
          </div>
          <div className="card-main">
            <div className="card-main-item">
              <p className="card-main-title">
                TOTAL STAKING WITHOUT DELEGATE{' '}
                <Tooltip title="The staking of you without delegate staking">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1>{toFormat(stakingWithoutDelegate.staked)} ETM</h1>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">
                REWARDS{' '}
                <Tooltip title="The rewards only of your staking.">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1>{toFormat(stakingWithoutDelegate.rewards)}ETM</h1>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">
                APY{' '}
                <Tooltip title="Annualized interest rate.">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1>{stakingWithoutDelegate.apy} %</h1>
              <p className="card-desc"> </p>
            </div>
            <div className="card-main-item-btns">
              <div
                className="btn-compound"
                onClick={() => {
                  setStakeDelegate(ADDRESS_0)
                  setShowStake(true)
                }}
              >
                Stake
              </div>
              <div className="btn-more">
                <img src={MoreSvg} alt="" />
                <div className="btn-more-menu">
                  <div>Convert to Delegate</div>
                  <div onClick={() => withdraw(ADDRESS_INFINITE, stakingWithoutDelegate.staked_)}>Unstake & Claim</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="all-validators card">
          <div className="card-title">
            <span>All Validators</span>
          </div>
          <table className="all-validators-pc">
            <tbody>
              <tr className="table-header">
                <th>Name</th>
                <th>Total Staked</th>
                <th>My Staked</th>
                <th>APY</th>
                <th> </th>
              </tr>
              {validatorsData.map((item, index) => (
                <tr className="content-tr" key={index}>
                  <td>
                    <div>
                      <img src={item.logo} alt="" />
                      <span>{formatAddress(item.address)}</span>
                    </div>
                  </td>
                  <td>{toFormat(item.totalSupply)} ETM</td>
                  <td>{toFormat(item.myStaked)} ETM</td>
                  <td>{item.apy} %</td>
                  <td>
                    <div>
                      <div
                        className="btn-compound"
                        onClick={() => {
                          setStakeDelegate(item.address)
                          setShowStake(true)
                        }}
                      >
                        Delegate
                      </div>
                      <div className="btn-more">
                        <img src={MoreSvg} alt="" />
                        <div className="btn-more-menu">
                          <div>Convert to another Delegate</div>
                          <div onClick={() => withdraw(item.address, stakingWithoutDelegate.staked_)}>
                            Unstake & Claim
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="all-validators-h5">
            {validatorsData.map((item, index) => (
              <div key={index}>
                <div className="all-validators-h5-t">
                  <div>
                    <img src={item.logo} alt="" />
                    <span>{formatAddress(item.address)}</span>
                  </div>
                </div>
                <div className="all-validators-h5-v">
                  <div>
                    <h2>Total Staked</h2>
                    <p>{toFormat(item.totalSupply)} ETM</p>
                  </div>
                  <div>
                    <h2>My Staked</h2>
                    <p>{toFormat(item.myStaked)} ETM</p>
                  </div>
                  <div>
                    <h2>APY</h2>
                    <p>{item.apy}%</p>
                  </div>
                </div>
                <div className="all-validators-h5-b">
                  <div>
                    <div
                      className="btn-compound"
                      onClick={() => {
                        setStakeDelegate(item.address)
                        setShowStake(true)
                      }}
                    >
                      Delegate
                    </div>
                  </div>
                  <div>
                    <div className="btn-more">
                      <img src={MoreSvg} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        title="Delegate Modal"
        visible={showStake}
        onOk={onStake}
        confirmLoading={stakeLoading}
        onCancel={() => setShowStake(false)}
      >
        <Input
          value={stakeValue}
          placeholder="amount"
          onChange={(e: any) => {
            setStakeValue(e.target.value)
          }}
        />
      </Modal>
    </StakingPage>
  )
}
