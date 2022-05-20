import React from 'react';
import style from './index.module.css'
import Banner from "../components/home/banner";
import Header from "../components/home/header";
import Block1 from "../components/home/block1";
import Block2 from "../components/home/block2";
import Block3 from "../components/home/block3";
import Block4 from "../components/home/block4";
import Footer from "../components/home/footer";

import Layout from '@theme/Layout';
import Eonothem from "../components/home/eonothem";
export default function Home() {

  return (
    <>
      <div style={{display: "none"}}>
        <Layout><div></div></Layout>
      </div>
      <Header/>
      <div className={style.homePage}>
        <Banner/>
        <Eonothem/>
        <Block1/>
        <Block3/>
        <Block4/>
        <Block2/>
      </div>
      <Footer/>
    </>
  );
}
