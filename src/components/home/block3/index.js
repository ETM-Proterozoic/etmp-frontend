import React from "react";
import './index.css'
import useBaseUrl from '@docusaurus/useBaseUrl';
const list = [
  {
    icon: '/img/home/block3-1.svg',
    title: 'MIME',
    desc: 'Web3 Social IM',
    tag: 'Social'
  },
  {
    icon: '/img/home/block3-2.svg',
    title: 'OpenVoice',
    desc: 'One of the coolest voice social apps that  allows Web3 users to tweet with voice, creatively integrating with NFTs to form a voice metaverse.',
    tag: 'Social'
  },
  {
    icon: '/img/home/block3-3.svg',
    title: 'SECTOKEN',
    desc: 'Combines blockchain, financial risk management and cybersecurity technologies and provides a security infrastructure for Web3 DApp.',
    tag: 'Infrastructure'
  },
  {
    icon: '/img/home/block3-4.svg',
    title: 'OpenPublish',
    desc: 'OpenPublish is the world’s first decentralized NFT Publisher. The goal is to build a high liquidity NFTs market. \n',
    tag: 'NFT'
  },
  {
    icon: '/img/home/block3-5.svg',
    title: 'PlayTop',
    desc: 'World\'s first NFT marketplace designed specifically for quadratic players with value and engagement. \n',
    tag: 'NFT'
  },
  {
    icon: '/img/home/block3-6.svg',
    title: 'GamePug',
    desc: 'Focuses on the needs of Blockchain game users for information, data and assets to create a Blockchain game community. ',
    tag: 'Game'
  }
]
export default function Block3(){
  return (
    <div className="home-block3">
      <h1 className="home-block3-title" id="Ecosystem">Ecosystem</h1>
      <div className="home-block3-list">
        {
          list.map((item, index) => (
            <div key={index} className="home-block3-item">
              <div>
                <img src={useBaseUrl(item.icon)} alt=""/>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
              <span>
              <span className={"home-block3-item-tag home-block3-tag-" + item.tag}>{item.tag}</span>
              </span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
