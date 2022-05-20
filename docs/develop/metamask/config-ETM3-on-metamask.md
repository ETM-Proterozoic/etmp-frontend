---
id: config-etm3-on-metamask
title: Add ETM/P Network
description: Build your next blockchain app on ETM/P.
keywords:
  - docs
  - ETM/P
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In order to view the flow of funds in your accounts, on the Polygon Network, you will need to configure ETM/P `{testnet, mainnet}` URL on Metamask.

There are two ways to do it:
1. [Using ETMPscan](/develop/metamask/config-etm3-on-metamask.md#Using-ETMPscan)
2. [Add the ETM/P network manually](/develop/metamask/config-etm3-on-metamask.md#add-the-etm3-network-manually)

### Using-ETMPscan

:::note
Please make sure you have already installed <ins>**[Metamask](https://metamask.io/)**</ins>!
:::

<Tabs
  defaultValue="mainnet"
  values={[
    { label: 'ETM/P-Mainnet', value: 'mainnet', },
  ]
}>

<TabItem value="mainnet">

Please follow the steps to add ETM/P’s Mainnet:

- Navigate to [etm.network](https://etm.network/)

<img src={useBaseUrl("img/metamask/mainnet-button.png")} />
<p></p>

- Scroll down to the bottom of the page and click on the button `Add ETM/P Network`

<img src={useBaseUrl("img/metamask/mainnet-addnetwork.png")} />

- Once you click the button you will see a Metamask Notification, now click on **Approve**.
You will be directly switched to ETM/P’s Mainnet now in the network dropdown list. You can now close the dialog.

</TabItem>

</Tabs>

If you are facing any issue, **Add the Network Manually(steps given below)**

### Add the ETM/P network manually

<Tabs
  defaultValue="mainnet"
  values={[
    { label: 'ETM/P-Mainnet', value: 'mainnet', }
  ]
}>


<TabItem value="mainnet">
To add ETM/P’s Mainnet, click on the Network selection dropdown and then click on Custom RPC.

<img src={useBaseUrl("img/metamask/select-network.png")} />

It will open up a form with 2 tabs on the top, Settings and Info. In the Settings tab you can add `ETM/P Mainnet` in the Network Name field, URL `https://polygon-rpc.com/` in the New RPC URL field, `137` in Chain ID field, `MATIC` in Currency Symbol field and `https://polygonscan.com/` in Block Explorer URL field.

<img src={useBaseUrl("img/metamask/metamask-settings-mainnet.png")} />

Once you’ve added the information click on Save. You will be directly switched to ETM/P’s Mainnet now in the network dropdown list. You can now close the dialog.
</TabItem>
</Tabs>

**You have successfully added ETM/P Network to your Metamask!**
