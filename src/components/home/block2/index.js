import React, {useState} from "react";
import './index.css'

const CheckOn = require('/img/home/block2-check-on.svg').default
const CheckOff = require('/img/home/block2-check-off.svg').default
const SelectOn = require('/img/home/block2-select-on.svg').default
const SelectOff = require('/img/home/block2-select-off.svg').default

const list = [
  {
    title: 'Q1 2022',
    items: [
      {
        finish: true,
        txt: 'Deploy & Start the ETM/P Testnet'
      },
      {
        finish: true,
        txt: 'Marketing & Social Media Partnership'
      },
      {
        finish: false,
        txt: 'Partnership Announcement'
      },
      {
        finish: false,
        txt: 'ETM/P Bridge Launch'
      }
    ]
  },
  {
    title: 'Q2 2022',
    items: [
      {
        finish: false,
        txt: 'Game Developer Partnership'
      },
      {
        finish: false,
        txt: 'Announce Token Governance Plan'
      },
      {
        finish: false,
        txt: 'Host a Hackathon For Developer'
      }
    ]
  },
  {
    title: 'Q3 2022',
    items: [
      {
        finish: false,
        txt: 'ETM/P Mainnet Launch'
      }
    ]
  }
]

export default function Block2() {
  const [select, setSelect] = useState(0)
  return (
    <div className="home-block2">
      <h1 className="home-block2-title" id="Roadmap">Roadmap</h1>
      {
        list.map((item, index) => (
          <div className={"home-block2-list" + (index === select ? ' active' : '')} key={index}>
            <div className="home-block2-list-box">
              <span className="home-block2-show-btn" onClick={() => setSelect(index)}>
                {select === index ? <SelectOn/> : <SelectOff/>}
              </span>
              <h1>{item.title}</h1>
              <div className="home-block2-list-items" style={{maxHeight: index === select ? item.items.length * 50 + 'px' : 0}}>
                {
                  item.items.map((it, idx) => (
                    <div key={idx}>
                      {it.finish ? <CheckOn/> : <CheckOff/>}
                      {it.txt}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
