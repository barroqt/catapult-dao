# As an administrator

As an **administrator**, reward the contributors for their participation at the end of the funding campaign:

## Prerequisites

- The campaign must be over
- The smart contract must have the reward tokens
- The user rewarded must have invested

```jsx 
    function distributeToken() external onlyAdmin() {
        require(block.timestamp > endDate, "The campaign is not over");
        require(fundingGoal == fundingToken.balanceOf(address(this)));
        require(hasInvested[investor], "This user did not invest");
        ...
    }
```

Give the investor a reward proportionnal to the investment

```jsx
    function distributeToken() external onlyAdmin() {
        ...
        uint amountToDistribute = (percentageDistributed[investor] * 100) / daoToken.balanceOf(address(this));
        ...
    }
```

Transfer token from the DAO to the smart contract, then from the smart contract to the investor

```jsx
    function distributeToken() external onlyAdmin() {
        ...
        fundingToken.transfer(daoAddress, amountToSend);
        daoToken.transferFrom(msg.sender, investor, amountToDistribute);
    }
```