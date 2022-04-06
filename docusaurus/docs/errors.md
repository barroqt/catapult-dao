---
sidebar_position: 4
---

# Errors / bugs in console:

`missing revert data in call exception` is for a bad network or bad function name/call

`invalid address or ENS name` = you need to add "" when use 0xaddr in a parameter

`Ownable: caller is not the owner` = deploy contracts with your private account key

`invalid arrayify value` = convert your value into Bytes32 (ex with ethers: ethers.utils.formatBytes32String(value))