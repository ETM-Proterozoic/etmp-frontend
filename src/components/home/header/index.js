import React, {useMemo, useState} from "react";
import './index.css'
import useIsBrowser from '@docusaurus/useIsBrowser';
import useBaseUrl from '@docusaurus/useBaseUrl';
import MenuModal from "../menu-modal";
import {changeNetWork} from "../../../utils/connectors";

const headerMenu = [
  {
    name: 'Technology',
    url: '#Technology',
    target: '_self'
  },
  {
    name: 'Ecosystem',
    url: '#Ecosystem',
    target: '_self'
  },
  {
    name: 'Tokenomic',
    url: '#Tokenomic',
    target: '_self'
  },
  {
    name: 'Roadmap',
    url: '#Roadmap',
    target: '_self'
  },
  {
    name: 'Developers',
    url: '/docs/develop/getting-started',
    target: '_self'
  },
  {
    name: 'Use ETM/P',
    children: [
      {
        name: 'Staking',
        url: 'https://app.etm.network/#/staking',
        icon: {
          on: '/img/header/staking-on.svg',
          off: '/img/header/staking-off.svg'
        },
        target: '_blank',
      },
      {
        name: 'Bridge',
        url: 'https://app.etm.network/#/bridge',
        icon: {
          on: '/img/header/bridge-on.svg',
          off: '/img/header/bridge-off.svg'
        },
        target: '_blank'
      },
      {
        name: 'Token Swap',
        url: 'https://app.etm.network/#/swap',
        icon: {
          on: '/img/header/tokenswap-on.svg',
          off: '/img/header/tokenswap-off.svg'
        },
        target: '_blank'
      },
      {
        name: 'Explorer',
        url: 'https://etmscan.network/',
        icon: {
          on: '/img/header/explorer-on.svg',
          off: '/img/header/explorer-off.svg'
        },
        target: '_blank'
      }
    ]
  }
]

export default function Header() {
  const Logo = useBaseUrl('/img/logo.svg');
  const Menu = useBaseUrl('/img/home/tab-menu.svg');
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const isBrowser = useIsBrowser();
  const handleScroll = (event) => {
    const scrollTop_ = (event.srcElement ? event.srcElement.documentElement.scrollTop : false)
      || window.pageYOffset
      || (event.srcElement ? event.srcElement.body.scrollTop : 0);
    if (scrollTop_ === 0) {
      setScrollTop(0)
    } else if (scrollTop === 0 && scrollTop_ > 0) {
      setScrollTop(1)
    }
  }
  useMemo(() => {
    if (isBrowser) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isBrowser])

  return (
    <>
      <div className={"header-view " + (scrollTop > 0 ? 'header-w' : 'header-t')}>
        <div className="header-box">
          <img src={Menu} className="header-menu-tab" alt="" onClick={() => setShowMenuModal(true)}/>
          <img src={Logo} className="logo" alt=""/>
        </div>
        <div className="header-menu">
          <div className="header-menu-list">
            {
              headerMenu.map((item, index) => <div className="header-menu-item" key={index}>
                {
                  item.children ? (
                    <>
                      <span>{item.name}</span>
                      <div className="header-menu-list-hover-view">
                        <div className="header-menu-add-network" onClick={changeNetWork}>
                          <img src={useBaseUrl('/img/header/metamask.svg')} alt=""/>
                          Add ETM/P Network to Metamask
                        </div>
                        <div className="header-menu-list-hover-view-items">
                          {
                            item.children.map((it, idx) => <a href={it.url} target={it.target} key={idx}>
                              <img src={useBaseUrl(it.icon.on)} alt=""/>
                              <img src={useBaseUrl(it.icon.off)} alt=""/>
                              {it.name}
                            </a>)
                          }
                        </div>
                      </div>
                    </>
                  ) : <a href={item.url} target={item.target}>{item.name}</a>
                }
              </div>)
            }
          </div>
          <a href="https://forms.gle/34XJ8eUNyN3a9c4X6" target="_blank" className="etm3-btn-black header-get-start-btn">Get Started</a>
        </div>
      </div>
      <MenuModal visible={showMenuModal} onClose={() => setShowMenuModal(false)} headerMenu={headerMenu}/>
    </>
  )
}

