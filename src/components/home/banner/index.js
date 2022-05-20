import React from "react";
import './index.css'

export default function Banner(){
  return (
    <div className="home-banner">
      <div className="home-banner-l">
        <h1>Powerful, Fast, Low Cost For Web3</h1>
        <p>ETM/P is a decentralized blockchain built to creative apps and games for everyone.</p>
        <div>
          <a href="https://forms.gle/34XJ8eUNyN3a9c4X6" target="_blank" className="etm3-btn-black banner-etm3-btn-black">Get Started</a>
          <a href="/docs/develop/getting-started/" target="_self" className="banner-etm3-btn-ghost">Dev Document</a>
        </div>
      </div>
      <div className="home-banner-r">
        <iframe src="/html/art/index.html" frameBorder="0"></iframe>
      </div>
    </div>
  )
}

