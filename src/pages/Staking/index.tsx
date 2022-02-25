import React from 'react'
import { StakingPage } from './style'
import InfoIcon from '../../assets/svg/staking/info-icon.svg'
import BannerBg from '../../assets/svg/staking/banner-bg.png'
import PageBG from '../../assets/svg/staking/bg.png'
import ArrowR from '../../assets/svg/staking/arrow-right.svg'

export default function Staking() {
  const allValidators = [
    {
      name: 'Validator 1',
      totalStaked: '125,125,670',
      myStaked: '12,5670',
      apy: '5%'
    },
    {
      name: 'Validator 1',
      totalStaked: '125,125,670',
      myStaked: '12,5670',
      apy: '5%'
    },
    {
      name: 'Validator 1',
      totalStaked: '125,125,670',
      myStaked: '12,5670',
      apy: '5%'
    },
    {
      name: 'Validator 1',
      totalStaked: '125,125,670',
      myStaked: '12,5670',
      apy: '5%'
    },
    {
      name: 'Validator 1',
      totalStaked: '125,125,670',
      myStaked: '12,5670',
      apy: '5%'
    },
    {
      name: 'Validator 1',
      totalStaked: '125,125,670',
      myStaked: '12,5670',
      apy: '5%'
    }
  ]
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
              <button className="banner-btn">
                Become a Delegator{' '}
                <span>
                  <img src={ArrowR} alt="" />
                </span>
              </button>
            </p>
          </div>
          <div className="banner-bg">
            <img src={BannerBg} alt="" />
          </div>
        </div>
        <div className="account-data card">
          <div className="card-title">
            <span>My Account</span>
          </div>
          <div className="card-main">
            <div className="card-main-item">
              <p className="card-main-title">
                BALANCE <img src={InfoIcon} alt="" />
              </p>
              <h1>123,670 ETM</h1>
              <p className="card-desc">$125670</p>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">
                STAKING <img src={InfoIcon} alt="" />
              </p>
              <h1>125,670 ETM</h1>
              <p className="card-desc">Locked 5000,000 ETM</p>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">
                REWARDS <img src={InfoIcon} alt="" />
              </p>
              <h1>25,670 ETM</h1>
              <p className="card-desc"> </p>
            </div>
            <div className="card-main-item-btns">
              {/*<div className="btn-compound">Compound</div>*/}
              {/*<div className="btn-claim">Claim</div>*/}
            </div>
          </div>
        </div>
        <div className="network-overview card">
          <div className="card-title">
            <span>Network Overview</span>
          </div>
          <div className="card-main">
            <div className="card-main-item">
              <p className="card-main-title">TOTAL VALIDATORS</p>
              <h1>21</h1>
              <p className="card-desc"> </p>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">TOTAL STAKE</p>
              <h1>2,552,025,643 ETM</h1>
              <p className="card-desc">$4466044875.250</p>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">TOTAL REWARD DISTRIBUTED</p>
              <h1>468,270,000 ETM</h1>
              <p className="card-desc">$819472500.000</p>
            </div>
            <div className="card-main-item">
              <p className="card-main-title">BOR BLOCK HEIGHT</p>
              <h1>25,055,151</h1>
              <p className="card-desc"> </p>
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
              {allValidators.map((item, index) => (
                <tr className="content-tr" key={index}>
                  <td>
                    <div>
                      <img src={InfoIcon} alt="" />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.totalStaked} ETM</td>
                  <td>{item.myStaked} ETM</td>
                  <td>{item.apy}</td>
                  <td>
                    <div>
                      <div className="btn-compound">Compound</div>
                      <div className="btn-claim">Claim</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="all-validators-h5">
            {allValidators.map((item, index) => (
              <div key={index}>
                <div className="all-validators-h5-t">
                  <div>
                    <img src={InfoIcon} alt="" />
                    <span>{item.name}</span>
                  </div>
                </div>
                <div className="all-validators-h5-v">
                  <div>
                    <h2>Total Staked</h2>
                    <p>{item.totalStaked} ETM</p>
                  </div>
                  <div>
                    <h2>My Staked</h2>
                    <p>{item.myStaked} ETM</p>
                  </div>
                  <div>
                    <h2>APY</h2>
                    <p>{item.apy} ETM</p>
                  </div>
                </div>
                <div className="all-validators-h5-b">
                  <div>
                    <div className="btn-compound">Compound</div>
                  </div>
                  <div>
                    <div className="btn-claim">Claim</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StakingPage>
  )
}
