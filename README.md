## Introduction

Avalanche is an open-source platform for launching decentralized applications and enterprise blockchain deployments in one interoperable, highly scalable ecosystem. Avalanche gives you complete control on both the network and application layers&mdash;helping you build anything you can imagine.

The Avalanche Network is composed of many blockchains. One of these blockchains is the C-Chain (Contract Chain), which is an Ethereum Virtual Machine instance. The C-Chain's API is almost identical to an Ethereum node's API. Avalanche offers the same interface as Ethereum but with higher speed, higher throughput, lower fees and lower transaction confirmation times. These properties considerably improve the performance of DApps and the user experience of smart contracts.

The goal of this guide is to lay out best practices regarding writing, testing and deployment of smart contracts to Avalanche's C-Chain. We'll be building smart contracts with development environment [Hardhat](https://hardhat.org).

## Prerequisites

### Run local node

```zsh
npx hardhat node
```

### Compile

```zsh
npx hardhat compile
```

and get the .json for the 2 contracts in `artifacts/contracts`. These 2 jsons will have to be copied and placed in the frontend.


### Deploy on your local node

```zsh
npx hardhat run --network local scripts/deploy.ts
```

You should keep the contract addresses and change `FACTORY_ADDRESS` in the config.js in the Frontend package.