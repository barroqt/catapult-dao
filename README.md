## Introduction

Avalanche is an open-source platform for launching decentralized applications and enterprise blockchain deployments in one interoperable, highly scalable ecosystem. Avalanche gives you complete control on both the network and application layers&mdash;helping you build anything you can imagine.

The Avalanche Network is composed of many blockchains. One of these blockchains is the C-Chain (Contract Chain), which is an Ethereum Virtual Machine instance. The C-Chain's API is almost identical to an Ethereum node's API. Avalanche offers the same interface as Ethereum but with higher speed, higher throughput, lower fees and lower transaction confirmation times. These properties considerably improve the performance of DApps and the user experience of smart contracts.

The goal of this guide is to lay out best practices regarding writing, testing and deployment of smart contracts to Avalanche's C-Chain. We'll be building smart contracts with development environment [Hardhat](https://hardhat.org).

## Prerequisites

### NodeJS and Yarn

First, install the LTS (long-term support) version of [nodejs](https://nodejs.org/en). This is `14.17.0` at the time of writing. NodeJS bundles `npm`.

Next, install [yarn](https://yarnpkg.com):

```zsh
npm install -g yarn
```


## Deploy on FUJI testnet

#### Prerequisite:

```zsh
$ export FUJI_PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY"
```

```zsh
$ hh compile
$ hh run scripts/deploy.ts --network fuji
```
