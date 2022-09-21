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
import StakingAbi from '../../constants/abis/Staking.json'
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
  '36': 36,
  '37': 37
  // '1': 1,
  // '4': 4
}

const STAKING_ADDRESS: {
  [propsName: string]: string
} = {
  '37': '0x0000000000000000000000000000000000001001',
  '36': '0x0000000000000000000000000000000000001001'
}

const DPOS_MINE_ADDRESS: {
  [propsName: string]: string
} = {
  '37': '0xBB232b2e4805b9A14C8d21b5A6A57c24bE54c878',
  '36': '0x5a76Cbdbc39e42CEa6C25E26Ca1B83f634074a0a'
}

const DPOS_ADDRESS: {
  [propsName: string]: string
} = {
  '36': '0x5d0e45ADC36cE397c27A95D376a753f9d7b01c9F',
  '37': '0x45781428F92b77072de8A1A99b9285337AbF8215'
}

const DEFAULT_VALIDATORS: {
  [propsName: string]: Array<string>
} = {
  '36': [
    '0x7D409286BC68144fb4Aa0fEdfBd886d896fA2a86',
    '0x653b492bb119689e33C3c8Ace65c29B9B0F8Dd26',
    '0x224b67B83301ddb7138Ed2A83CfAF551b40be72A',
    '0x125cCfFAd7D46408b20C9b13e1273F1FC6799C12',
    '0xE85e78eF441e2B48330e7a14000615B3f482CB87',
    '0xe0207E244C854b7898710511b53AeE0E40ED21B1',
    '0x3BAcAe6565c8034ef4C2DF088349b90ed3BaB256',
    '0x148b38b973f35afC9f9879d317EC49281dFf27D6',
    '0xd9aace7C886895539bD3d76B524f83D8E8a8559D',
    '0x0c4d9a7f753Ac0f0cce88EdEAc31A41211823981',
    '0xcf81F23210B7B489d2e1113A430d67C92c478aFd',
    '0xed6BD81b2b0de50bD9804d616B38F9d5b8FB279b',
    '0xD003C3497AfDd0bceAdd9Cc54dAEccEb5f4dA500',
    '0x5563A4230590235948593DBf6d5963Abab614473',
    '0xA22A37b2b36639Ea2DA817E522d7deA023998CB1',
    '0xfbB0aBD9E7C34Bde575aAF50f7D48ac37a065d2c',
    '0xFc40833399e82976426C7328c426381e4c8e2414',
    '0xfF15bFc3888Ef98D752ffE74cE6dFA48C4E00Db2',
    '0xF00b25F4688060180E830a90F999230C032CdfD0',
    '0xcd086Ae3A3D47b24bB5d7aF1B2673DF92C70Fc7C',
    '0x4d281E65d3dDc14b580B98Bd4F51C790474C611C'
  ],
  '37': [
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
  const stakingAddress = STAKING_ADDRESS[callChainId]

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
    totalReward: ''
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
      dposContract.APR(ZERO_ADDRESS),
      dposContract.balanceOf(ZERO_ADDRESS, account),
      dposContract.earned(ZERO_ADDRESS, account)
    ]
    multicallClient(calls).then((res: any) => {
      const apr = fromWei(res[0]).toNumber()
      const apy = (Math.pow(1 + apr / 365, 365) * 100).toFixed(2)
      const staked = fromWei(res[1]).toFixed(2)
      const rewards = fromWei(res[2]).toFixed(2)
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
    const stakingContract = newContract(StakingAbi, stakingAddress, callChainId)
    const calls = [
      dposContract.totalSupply(),
      dposMineContract.balanceOf(ADDRESS_INFINITE),
      stakingContract.validators()
    ]
    multicallClient(calls).then(async (res: any) => {
      const validators_ = lodash.uniqBy([...res[2], ...defaultValidators], lodash.toLower)
      setTotalData({
        totalSupply: fromWei(res[0], 18).toFixed(0),
        totalReward: fromWei(res[1], 18).toFixed(0)
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
        for (let i = 0, ii = 0; i < validators_.length; i++) {
          const address = validators_[i]
          const apr = fromWei(res2[ii]).toNumber()
          const apy = (Math.pow(1 + apr / 365, 365) * 100).toFixed(2)
          const totalSupply = fromWei(res2[ii + 1], 18).toFixed(6)
          let myStaked = '0'
          let myEarned = '0'
          let myStaked_ = '0'
          let myEarned_ = '0'
          if (account) {
            myStaked = fromWei(res2[ii + 2]).toFixed(2)
            myStaked_ = res2[ii + 2]
            myEarned = fromWei(res2[ii + 3]).toFixed(2)
            myEarned_ = res2[ii + 3]
            ii += 4
          } else {
            ii += 2
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
      .compoundAll(ADDRESS_INFINITE)
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
  const withdraw = (delegate: string, value: string) => {
    if (Number(value) < 0) {
      return
    }
    const contract = getWeb3Contract(library, DPOSAbi, dposAddress)
    contract.methods
      .withdraw(delegate, value)
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
              <h1>{totalData.totalReward ? toFormat(totalData.totalReward) : '-'} ETMP</h1>
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
                    <div onClick={() => withdraw(ADDRESS_INFINITE, stakingWithoutDelegate.staked_)}>
                      Unstake & Claim
                    </div>
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

                            <div onClick={() => withdraw(item.address, stakingWithoutDelegate.staked_)}>
                              Unstake & Claim
                            </div>
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
