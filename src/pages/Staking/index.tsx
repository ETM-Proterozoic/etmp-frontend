import React, { useMemo, useState } from 'react'
import { BtnMoreMenu, CoverTo, StakingPage } from './style'
import InfoIcon from '../../assets/svg/staking/info-icon.svg'
import BannerBg from '../../assets/svg/staking/banner-bg.png'
// import ArrowR from '../../assets/svg/staking/arrow-right.svg'
import MoreSvg from '../../assets/svg/staking/more.svg'
import MoreDarkSvg from '../../assets/svg/staking/more-dark.svg'
import { multicallClient, newContract } from '../../constants/multicall/index'
import { useActiveWeb3React } from '../../hooks'
import DPOSAbi from '../../constants/abis/DPOS.json'
import DposMineAbi from '../../constants/abis/DposMine.json'
import { formatAddress, fromWei, numToWei, toFormat } from '../../utils/format'
import { getWeb3Contract } from '../../utils'
import { Input, message, Modal, Popover, Tooltip } from 'antd'
import { ADDRESS_INFINITE, ZERO_ADDRESS } from '../../constants'
import { useDarkModeManager } from '../../state/user/hooks'
import { ChainId } from '@etmp/sdk'
import lodash from 'lodash'

const superChainIds: {
  [propsName: string]: number
} = {
  '48': 48,
  '49': 49
  // '1': 1,
  // '4': 4
}

const DPOS_MINE_ADDRESS: {
  [propsName: string]: string
} = {
  '49': '0xBB232b2e4805b9A14C8d21b5A6A57c24bE54c878',
  '48': '0x5a76Cbdbc39e42CEa6C25E26Ca1B83f634074a0a'
}

const DPOS_ADDRESS: {
  [propsName: string]: string
} = {
  '49': '0x45781428F92b77072de8A1A99b9285337AbF8215',
  '48': '0x5d0e45ADC36cE397c27A95D376a753f9d7b01c9F'
}

const DEFAULT_VALIDATORS: {
  [propsName: string]: Array<string>
} = {
  '48': [
    '0x7D409286BC68144fb4Aa0fEdfBd886d896fA2a86',
    '0x653b492bb119689e33C3c8Ace65c29B9B0F8Dd26',
    '0x224b67B83301ddb7138Ed2A83CfAF551b40be72A',
    '0x125cCfFAd7D46408b20C9b13e1273F1FC6799C12'
  ],
  '49': [
    '0x1645B9512c43a5A792dF86631Be18eE34397337a',
    '0x2860fD12b5687A3fe1A1cd3CBD213d7054E53976',
    '0x0489b78Aa10490ee0a03c65944DB56428fE7784b',
    '0x5F73f812C2e4CAD5Ab6B81b1068a7221ABC62A38'
  ]
}

interface ValidatorsData {
  address: string
  logo: string
  totalSupply: string
  myStaked: string
  myStaked_: string
  apy: string
  myEarned: string
  myEarned_: string
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
  totalRewardDistributed: string
}

function CoverToView({
  validatorsData,
  validator,
  coverTo,
  value
}: {
  validatorsData: ValidatorsData[]
  validator: string
  coverTo: Function
  value: string
}) {
  return (
    <CoverTo>
      <div className="cover-to-title">Convert to</div>
      <div className="cover-to-main">
        {validator !== ZERO_ADDRESS && (
          <div key={ZERO_ADDRESS} onClick={() => coverTo(validator, ZERO_ADDRESS, value)}>
            <img src={`https://avatars.dicebear.com/api/bottts/${ZERO_ADDRESS}.svg`} alt="" />
            <span>0x0</span>
            <span>(Staking Without Delegate)</span>
          </div>
        )}
        {validatorsData.map((item: ValidatorsData) => {
          if (item.address === validator) {
            return null
          } else {
            return (
              <div key={item.address} onClick={() => coverTo(validator, item.address, value)}>
                <img src={item.logo} alt="" />
                <span>{formatAddress(item.address)}</span>
              </div>
            )
          }
        })}
      </div>
    </CoverTo>
  )
}

export default function StakingView() {
  const { account, library, chainId } = useActiveWeb3React()
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const callChainId = useMemo(() => superChainIds[chainId] || ChainId.ETMP, [chainId])
  const dposMainAddress = DPOS_MINE_ADDRESS[callChainId]
  const dposAddress = DPOS_ADDRESS[callChainId]
  const defaultValidators = DEFAULT_VALIDATORS[callChainId]

  const [blockNumber, setBlockNumber] = useState<string>('')
  const [validatorsData, setValidatorsData] = useState<ValidatorsData[]>([])
  const [compoundLoading, setCompoundLoading] = useState<boolean>(false)
  // const [claimLoading, setClaimLoading] = useState<boolean>(false)
  const [stakeLoading, setStakeLoading] = useState<boolean>(false)
  const [showStake, setShowStake] = useState<boolean>(false)
  const [stakeValue, setStakeValue] = useState<string>('')
  const [stakeDelegate, setStakeDelegate] = useState<string | null>(null)
  const [ethBalance, setETHBalance] = useState<number>(0)
  const [darkMode] = useDarkModeManager()
  const [totalData, setTotalData] = useState<TotalSupply>({
    totalSupply: '',
    totalReward: '',
    totalRewardDistributed: ''
  })
  const [update, setUpdate] = useState<number>(0)
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
    const dposContract = newContract(DPOSAbi, dposAddress, callChainId)
    const calls = [
      dposContract.APR(ADDRESS_INFINITE),
      dposContract.balanceOf(ZERO_ADDRESS, account),
      dposContract.earnedOfNegative1(ZERO_ADDRESS, account)
    ]
    multicallClient(calls).then((res: any) => {
      const apr = fromWei(res[0]).toNumber()
      const apy = (Math.pow(1 + apr / 365, 365) * 100).toFixed(2)
      console.log('without apy: ', apy)
      const staked = fromWei(res[1], 18).toFixed(6)
      const rewards = fromWei(res[2], 18).toFixed(6)
      console.log('rewards: ', res[2])
      setStakingWithoutDelegate({
        apy,
        apr: (apr * 100).toFixed(2),
        staked,
        rewards,
        staked_: res[1],
        rewards_: res[2]
      })
    })
  }

  const getValidators = () => {
    const dposMineContract = newContract(DposMineAbi, dposMainAddress, callChainId)
    const dposContract = newContract(DPOSAbi, dposAddress, callChainId)

    const calls = [
      dposContract.totalSupply(),
      dposMineContract.balanceOf(ADDRESS_INFINITE),
      dposContract.delegates(),
      dposContract.totalRewardsDistributedOf(ADDRESS_INFINITE)
    ]
    multicallClient(calls).then(async (res: any) => {
      let validatorSets = res[2]
      if (!Array.isArray(validatorSets)) {
        validatorSets = []
      }
      console.log('validators: ', validatorSets)
      console.log('chainID: ', chainId)
      // const validators_ = lodash.uniqBy([...validatorSets, ...defaultValidators], lodash.toLower)
      const validators_ = lodash.uniq([...defaultValidators, ...res[2]])

      setTotalData({
        totalSupply: fromWei(res[0], 18).toFixed(0),
        totalReward: fromWei(res[1], 18).toFixed(0), // dexiang: 应该为 -1 池代币的奖励？？
        totalRewardDistributed: fromWei(res[3], 18).toFixed(0)
      })
      console.log(
        'TOTAL REWARD REMAINING: ',
        fromWei(res[1], 18).toFixed(6),
        'TOTAL REWARD DISTRIBUTED: ',
        fromWei(res[3], 18).toFixed(6)
      )
      const validators: ValidatorsData[] = []
      const validatorsCallList = []
      for (let i = 0; i < validators_.length; i++) {
        validatorsCallList.push(dposContract.APR(validators_[i]), dposContract.totalSupplyOf(validators_[i]))
        validatorsCallList.push(dposContract.APR(ADDRESS_INFINITE))
        if (account) {
          validatorsCallList.push(dposContract.balanceOf(validators_[i], account))
          validatorsCallList.push(dposContract.earned(validators_[i], account))
          validatorsCallList.push(dposContract.earnedOfNegative1(validators_[i], account))
        }
      }
      console.log('validators_ length: ', validators_.length)

      multicallClient(validatorsCallList).then((res2: any) => {
        for (let i = 0, ii = 0; i < validators_.length; i++) {
          console.log('account: ', account, ', validators :', validators_[i], ', apr: ', res2[i])
          const address = validators_[i]
          const apr = fromWei(res2[ii]).toNumber()
          // let apy = (Math.pow(1 + apr / 365, 365) * 100).toFixed(2)
          const aprWithoutDelegate = fromWei(res2[ii + 2]).toNumber()
          const apy = (Math.pow(1 + (apr + aprWithoutDelegate) / 365, 365) * 100).toFixed(2)

          const totalSupply = fromWei(res2[ii + 1], 18).toFixed(6)
          let myStaked = '0'
          let myEarned = '0'
          let myStaked_ = '0'
          let myEarned_ = '0'
          if (account) {
            myStaked = fromWei(res2[ii + 3], 18).toFixed(6)
            myStaked_ = res2[ii + 3]

            const earnedI = fromWei(res2[ii + 4]).toNumber()
            const earnedII = fromWei(res2[ii + 5]).toNumber()

            myEarned = (earnedI + earnedII).toFixed(6)
            myEarned_ = (earnedI + earnedII).toString()
            ii += 6
          } else {
            ii += 3
          }
          validators.push({
            address,
            logo: `https://avatars.dicebear.com/api/bottts/${address}.svg`,
            totalSupply,
            myStaked,
            myEarned,
            apy,
            apr: (apr * 100).toFixed(2),
            myStaked_,
            myEarned_
          })
        }
        setValidatorsData(validators)
      })
    })
  }
  const getBlockHeight = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    multicallClient.getBlockInfo(callChainId).then((res: any) => {
      setBlockNumber(res.number)
    })
  }
  const getETHBalance = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    multicallClient.getEthBalance(account, chainId).then((res: any) => {
      console.log('eth balance: ', Number(fromWei(res, 18).toFixed(3)))
      setETHBalance(Number(fromWei(res, 18).toFixed(3)))
      console.log(account, chainId, ethBalance)
    })
  }
  const onCompoundAll = () => {
    if (compoundLoading) {
      return
    }
    setCompoundLoading(true)
    const contract = getWeb3Contract(library, DPOSAbi, dposAddress)
    contract.methods
      .compoundAll()
      .send({
        from: account
      })
      .on('receipt', () => {
        setUpdate(update + 1)
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
    const contract = getWeb3Contract(library, DPOSAbi, dposAddress)
    const stakeValue_ = numToWei(stakeValue, 18)
    console.log('Delegate address: ', stakeDelegate)
    contract.methods
      .stake(stakeDelegate)
      .send({
        from: account,
        value: stakeValue_
      })
      .on('receipt', () => {
        setUpdate(update + 1)
        setStakeLoading(false)
        setShowStake(false)
      })
      .on('error', () => {
        setStakeLoading(false)
      })
  }

  // dexiang:  delegate=0 表示 非代理质押提币
  const withdraw = (delegate: string, value: string) => {
    if (Number(value) < 0) {
      return
    }
    const contract = getWeb3Contract(library, DPOSAbi, dposAddress)
    contract.methods
      .exit(delegate)
      .send({
        from: account
      })
      .on('receipt', () => {
        setUpdate(update + 1)
        message.success('Unstake & Claim success')
      })
      .on('error', () => {
        message.error('Unstake & Claim fail')
      })
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const coverTo = (delegate: string, toDelegate: string, value: string) => {
    if (Number(value) <= 0) {
      return message.warn('Currently no staking')
    }
    const contract = getWeb3Contract(library, DPOSAbi, dposAddress)
    contract.methods
      .transfer(delegate, toDelegate, value)
      .send({
        from: account
      })
      .on('receipt', () => {
        setUpdate(update + 1)
        message.success('success')
      })
      .on('error', () => {
        message.error('fail')
      })
  }
  useMemo(() => {
    getBlockHeight()
  }, [update, callChainId])
  useMemo(() => {
    getValidators()
    if (account) {
      getStakingWithoutDelegate()
      getETHBalance()
    }
  }, [account, callChainId, update])
  return (
    <StakingPage>
      <div className="staking-page">
        <div className="banner">
          <div>
            <h1>Start Earning rewards with</h1>
            <h1>
              ETM<span>/P</span> Staking.
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
              <h1>{totalData.totalSupply ? toFormat(totalData.totalSupply) : '-'} ETMP</h1>
              {/*<p className="card-desc">$</p>*/}
            </div>
            <div className="card-main-item">
              <p className="card-main-title">TOTAL REWARD DISTRIBUTED</p>
              <h1>{totalData.totalRewardDistributed ? toFormat(totalData.totalRewardDistributed) : '-'} ETMP</h1>
              {/*<p className="card-desc">$</p>*/}
            </div>
            <div className="card-main-item">
              <p className="card-main-title">BLOCK HEIGHT</p>
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
              <h1>{ethBalance + myAllStaking} ETMP</h1>
              {/*<p className="card-desc">$125670</p>*/}
            </div>
            <div className="card-main-item">
              <p className="card-main-title">
                TOTAL STAKING
                <Tooltip title="Including your staking and delegate staking.">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1>{myAllStaking} ETMP</h1>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">
                TOTAL REWARDS{' '}
                <Tooltip title="The rewards include staking rewards and validators node gas fee rewards.">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1>{myAllRewards} ETMP</h1>
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
                MY STAKED{' '}
                <Tooltip title="The staking of you without delegate staking">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1>{toFormat(stakingWithoutDelegate.staked)} ETMP</h1>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">
                REWARDS{' '}
                <Tooltip title="The rewards only of your staking.">
                  <img src={InfoIcon} alt="" />
                </Tooltip>
              </p>
              <h1>{toFormat(stakingWithoutDelegate.rewards)}ETMP</h1>
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
                  setStakeLoading(false)
                  setStakeDelegate(ZERO_ADDRESS)
                  setShowStake(true)
                }}
              >
                Stake
              </div>
              <Popover
                placement="bottomRight"
                content={() => (
                  <BtnMoreMenu>
                    <Popover
                      placement="bottom"
                      content={
                        <CoverToView
                          validatorsData={validatorsData}
                          validator={ZERO_ADDRESS}
                          value={stakingWithoutDelegate.staked_}
                          coverTo={coverTo}
                        />
                      }
                    >
                      <div>Convert to Delegate</div>
                    </Popover>

                    <div onClick={() => withdraw(ZERO_ADDRESS, stakingWithoutDelegate.staked_)}>Unstake & Claim</div>
                  </BtnMoreMenu>
                )}
              >
                <div className="btn-more">
                  <img src={darkMode ? MoreDarkSvg : MoreSvg} alt="" />
                </div>
              </Popover>
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
                <th>My Rewards</th>
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
                  <td>{toFormat(item.totalSupply)} ETMP</td>
                  <td>{toFormat(item.myStaked)} ETMP</td>
                  <td>{toFormat(item.myEarned)} ETMP</td>
                  <td>{item.apy} %</td>
                  <td>
                    <div>
                      <div
                        className="btn-compound"
                        onClick={() => {
                          setStakeLoading(false)
                          setStakeDelegate(item.address)
                          setShowStake(true)
                        }}
                      >
                        Delegate
                      </div>

                      <Popover
                        placement="bottomRight"
                        content={() => (
                          <BtnMoreMenu>
                            <Popover
                              placement="bottom"
                              content={
                                <CoverToView
                                  validatorsData={validatorsData}
                                  validator={item.address}
                                  coverTo={coverTo}
                                  value={item.myStaked_}
                                />
                              }
                            >
                              <div>Convert to another Delegate</div>
                            </Popover>
                            <div onClick={() => withdraw(item.address, item.myStaked_)}>Unstake & Claim</div>
                          </BtnMoreMenu>
                        )}
                      >
                        <div className="btn-more">
                          <img src={darkMode ? MoreDarkSvg : MoreSvg} alt="" />
                        </div>
                      </Popover>
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
                    <p>{toFormat(item.totalSupply)} ETMP</p>
                  </div>
                  <div>
                    <h2>My Staked</h2>
                    <p>{toFormat(item.myStaked)} ETMP</p>
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
                        setStakeLoading(false)
                        setStakeDelegate(item.address)
                        setShowStake(true)
                      }}
                    >
                      Delegate
                    </div>
                  </div>
                  <div>
                    <div className="more-popover">
                      <Popover
                        trigger="click"
                        placement="bottomRight"
                        content={() => (
                          <BtnMoreMenu>
                            <Popover
                              placement="bottom"
                              content={
                                <CoverToView
                                  validatorsData={validatorsData}
                                  validator={item.address}
                                  coverTo={coverTo}
                                  value={item.myStaked_}
                                />
                              }
                            >
                              <div>Convert to another Delegate</div>
                            </Popover>

                            <div onClick={() => withdraw(item.address, item.myStaked_)}>Unstake & Claim</div>
                          </BtnMoreMenu>
                        )}
                      >
                        <div className="btn-more">
                          <img src={darkMode ? MoreDarkSvg : MoreSvg} alt="" />
                        </div>
                      </Popover>
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
