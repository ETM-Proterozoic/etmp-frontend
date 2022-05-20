import { message } from 'react-message-popup'
export function changeNetWork () {
  if (!window.ethereum){
    return message.error('no metamask wallet', 1500)
  }
  window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x24',
        chainName: 'ETM/P Mainnet',
        nativeCurrency: {
          name: 'ETM',
          symbol: 'ETM',
          decimals: 18,
        },
        rpcUrls: ['https://rpc.etm.network/'],
        blockExplorerUrls: ['https://etmscan.network'],
      }
    ],
  }).then(() => {
    message.success('success', 1000)
  }).catch(() => {
  })
}
