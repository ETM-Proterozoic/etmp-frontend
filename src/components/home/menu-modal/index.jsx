import React from "react";
import './index.css'
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function MenuModal({visible, onClose, headerMenu}){

  const Logo = useBaseUrl('/img/logo.svg');
  return (
    <div className={"menu-modal" + (visible ? ' active' : '')} onClick={onClose}>
      <div className="menu-modal-panel" onClick={(e)=>{
        e.stopPropagation()
        return false
      }}>
        <div className="menu-modal-logo">
          <img src={Logo} alt=""/>
        </div>
        <div className="menu-modal-links">
          {
            headerMenu.map((item, index) => (
              <div key={index} className="menu-modal-link">
                {
                  item.children ? (
                    <span>
                      {item.name}
                      {
                        item.children.map((it, idx) => (
                          <a href={it.url} key={idx} target="_blank">{it.name}</a>
                        ))
                      }
                    </span>
                  ) : (
                    <a href={item.url} onClick={onClose}>{item.name}</a>
                  )
                }

              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
