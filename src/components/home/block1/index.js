import React from "react";
import './index.css'
import useBaseUrl from '@docusaurus/useBaseUrl';
const list = [
  {
    title: 'ETH Compatibility',
    desc: 'Fully compatible with EVM, Solidity, seamless migration of ETH DApp',
    icon: '/img/home/block1-1.svg'
  },
  {
    title: 'ETH 2.0 Compatibility',
    desc: 'Support WASM virtual machine, future-proof compatible with ETH 2.0',
    icon: '/img/home/block1-2.svg'
  },
  {
    title: '0 Gas',
    desc: 'Consensus based on UPoS, supports 0 Gas transactions',
    icon: '/img/home/block1-3.svg'
  },
  {
    title: 'Non-inductive Bridge',
    desc: 'Support asset, data, application, smart contract cross-chain',
    icon: '/img/home/block1-4.svg'
  },
  {
    title: 'DAO Protocol',
    desc: 'DAO-based collaborative governance',
    icon: '/img/home/block1-5.svg'
  },
  {
    title: 'Modularity',
    desc: 'High customizability, extensibility and upgradeability',
    icon: '/img/home/block1-6.svg'
  },

]
export default function Block1(){
  return (
    <div className="home-block1">
      <h1 className="home-block1-title" id="Technology">Technology</h1>
      <div className="home-block1-list">
        {
          list.map((item, index) => (
            <div key={index} className="home-block1-item">
              <img src={useBaseUrl(item.icon)} alt=""/>
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}
