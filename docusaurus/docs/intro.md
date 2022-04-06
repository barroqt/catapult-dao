---
sidebar_position: 1
---

# Tutorial - How To Launch

Let's discover **Catapult-DAO in less than 5 minutes**.

## Getting Started

Get started by **installing the dependencies** to be able to launch the project. 

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.
- [Hardhat-shorthand](https://hardhat.org/guides/shorthand.html) (npm i -g hardhat-shorthand)

## Start the Catapult

Here is the way to launch the project.
You will need two instances.
One for the backend, propulsed by hardhat and running on Avalanche Fuji Network.
The other one is a Dapp built with React.

#### Server
```bash
cd catapult-dao
hh compile
hh run scripts/deploy.ts --network fuji
```
The `cd` command changes the directory you're working with.

The `hh compile` do(todo)...

The `hh run scripts/deploy.ts --network fuji` do(todo)...

#### Front
```bash
cd catapultDAO-frontend
npm install
npm start
```

The command `npm install` installs all necessary dependencies you need to run Catapult-DAO.

The `npm start` command builds the website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.


#### Connect with Local Server

Launch the node
```bash
cd catapult-dao
export FUJI_PRIVATE_KEY="YOUR_FUJI_KEY"
npx hardhat node
```
Now running on localhost:8545

Launch your deploy, in another terminal
```bash
cd catapult-dao
export FUJI_PRIVATE_KEY="YOUR_FUJI_KEY"
npx hardhat run --network local scripts/deploy.ts
```
The deployement script will automatically copy and paste artifacts from contracts built into the front-end repository.


## Connect with Fuji Testnet

Add the network to your wallet

    Network Name: Avalanche FUJI C-Chain
    New RPC URL: https://api.avax-test.network/ext/bc/C/rpc
    Chain ID: 43113
    Symbol: AVAX
    Explorer: https://testnet.snowtrace.io/

Use a faucet to add some AVAX
    
    https://faucets.chain.link/fuji

    https://faucet.avax-test.network/
