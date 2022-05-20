---
id: network
title: Network
description: Build your next blockchain app on ETM/P.
keywords:
  - docs
  - ETM/P
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="mainnet"
  values={[
    { label: 'ETM/P-Mainnet', value: 'mainnet', },
    { label: 'ETM/P-Testnet', value: 'testnet', },
  ]
}>
<TabItem value="testnet">

# ETM/P-Testnet
Mumbai Testnet replicates the ETM/P Mainnet, which is to be used for testing. Testnet coins are separate and distinct from actual tokens/assets, and are never supposed to have any value. This allows application developers or validators/testers to experiment, without having to use real assets or worrying about breaking the main ETM/P chain.

The documentation corresponding contains details for the RPC - HTTP endpoints. There is also a full node setup if you wish to setup your own full node.

|              |                                        |
|--------------|----------------------------------------|
| NetworkName  | **Testnet**                                 
| chainId      | `37`                                  |
| Gas Token    | `ETM/P Token`|
| RPC          | `https://testnet-rpc.etm.network`
| Block Explorer |[`https:/test.etmscan.network/`](https://test.etmscan.network/)|



:::important
ETM/P network native token is **ETM/P** which will be used as gas fee.
:::

</TabItem>
<TabItem value="mainnet">

# ETM/P-Mainnet

🎉Finally!!! ETM/P Mainnet is open for developers🎉

The documentation corresponding contains details for the RPC - HTTP. There is also a full node setup if you wish to setup your own full node.


|              |                                        |
|--------------|----------------------------------------|
| NetworkName  | **ETM/P Mainnet**                                                              |
| chainId      | `36`                                  |
| Gas Token    | `ETM/P Token` |
| RPC    | [`https://rpc.etm.network`](https://rpc.etm.network) |
| Block Explorer | [`https://etmscan.network/`](https://www.etmscan.network/)|



:::important
ETM/P network native token is **ETM/P** which will be used as gas fee.
:::

</TabItem>
</Tabs>
