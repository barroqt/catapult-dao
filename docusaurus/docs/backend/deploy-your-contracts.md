---
sidebar_position: 5
---

# Deploy your contracts

## install your dependencies

Export your **private key**:

```bash
hh compile
```

Install the packages:

```bash 
yarn
```

## Deploy your site

Compile:

```bash
hh compile
```

Deploy the contracts on FUJI testnet:

```bash
hh run scripts/deploy.ts --network fuji
```
