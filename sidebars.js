/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  introduction: [
    "basics/blockchain",
    "basics/blockchain-types",
    "basics/consensus-mechanism",
    "basics/ethereum",
    "basics/solidity",
    "basics/transactions",
    "basics/gas",
    "basics/accounts",
    // "basics/sidechain",
    "basics/import-account-to-metamask",
  ],
  development: [
    "develop/getting-started",
    {
      type: "category",
      label: "Deploying on ETM/P",
      items: [
        "develop/deploying/remix",
        "develop/deploying/truffle",
        "develop/deploying/hardhat",
      ],
    },
    {
      type: "category",
      label: "Network Details",
      items: [
        "develop/network-details/network",
        "develop/network-details/mapped-tokens",
        "develop/network-details/full-node-binaries",
      ],
    },
    {
      type: "category",
      label: "Configure ETM/P on Metamask",
      items: [
        "develop/metamask/overview",
        "develop/metamask/hello",
        "develop/metamask/config-etm3-on-metamask",
        "develop/metamask/multiple-accounts",
      ],
    },
  ],
};
