# Catapult-DAO

This project's genesis takes place in Barcelona, during the avalanche summit hackaton 2022.

## The avalanche network

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

## How does it work?

**Roles (identified by wallet address)**

- Administrator
- Investor

**Definitions**

- *Contract.* Refers to this smart contract.
- *Currency.* Either AVAX or an ERC20 token.
- *Investment.*
    - An Investment gets funded by Investors in a Currency.
    - An Investment has an Funding Goal, which is the total Currency required for the Investment to be fully funded.
    - An Investment can have many Allocations
    - An Investment has a Funding Period, identified by a Start Date and an End Date. Investors can fill their Allocations between these dates. 
- *Allocation* 
    - An Allocation has an Investor.
    - An Allocation has an Initial Size (the total Currency that the Investor is permitted to send for the Investment, during the Funding Period).
    - An Allocation has a Final Size (the total Currency that the Investor actually sent to the Investment during the Funding Period).
- *Tokens.* Investors will typically make Investments in hopes of receiving ERC20 Tokens back from the project they invest in.
- *Distribution.* For a given Investment, the Contract can distribute Tokens to Investors according to the Final Sizes of the Allocations in an Investment.

**User Stories**

- As an Administrator, I can create an Investment.
- As an Administrator, I can set the Allocations for an Investment if the Funding Period has not started yet.
- As an Investor, I can fund an Investment during the Funding Period, if I have an Allocation.
- As an Administrator, I can withdraw the funds from the Investment after the Funding Period.
- As an Administrator, I can trigger Distribution of Tokens for an Investment (by sending Tokens to the Contract & identifying the Investment).

**Example #1 - Creating & Funding an Investment**

1. Administrator creates an Investment, to be funded $10,000 (Funding Goal) in USDC.e (Currency).
2. Administrator sets Allocations for the Investment. Investor 1 can fill $5,000. Investor 2 can fill $2,500. Investor 3 can fill $2,500.
3. The Funding Period starts
4. Investor 1 funds the Investment with $5,000 in USDC.e.
5. Investor 2 funds the Investment with $2,500 in USDC.e.
6. Investor 3 funds the Investment with $2,500 in USDC.e.
7. The Funding Period ends
8. Administrator withdraws funds from the Investment.

**Example #2 - Distributing Tokens**

1. Administrator triggers Distribution for an Investment.
2. Contract sends Tokens to Investors according to the Final Sizes of the Allocations in the Investment. Following from Example #1, the tokens would be distributed as follows:
    - 50% to Investor 1
    - 25% to Investor 2
    - 25% to Investor 3

**Investment Underfunded**

Investors get the opportunity to fund an Investment during the Funding Period, according to the Allocation they have received. If the Investment does not reach its Funding Goal, the Administrator has options for collecting the remaining funds:

- Add another funding round, with new Allocations.
- Open the Investment up to all Investors ("free for all").

**Investment Overfunded**

It is not possible for Investors to fund more than the total Funding Goal of the Investment.
