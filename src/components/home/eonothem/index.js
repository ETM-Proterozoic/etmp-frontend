import React from "react";
import './index.css'
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Eonothem(){
  return (
    <div className="eonothem-view">
      <h1 className="eonothem-view-title">Eonothem</h1>
      <p className="eonothem-view-desc">The development timeline of Eonothem blockchain will be in 4 stages: Hadean, Archean, Proterozoic, and Phanerozoic.
        We are now in Proterozoic, i.e. ETM/P. The eventual form of ETM will be Phanerozoic (ETM/Ph).</p>
      <div className="eonothem-show">
        <div className="eonothem-show-box">
          <img src={useBaseUrl('/img/home/eonothem-4.svg')} alt=""/>
          <img src={useBaseUrl('/img/home/eonothem-3.svg')} alt=""/>
          <img src={useBaseUrl('/img/home/eonothem-2.svg')} alt=""/>
          <img src={useBaseUrl('/img/home/eonothem-1.svg')} alt=""/>
        </div>
      </div>
    </div>
  )
}
