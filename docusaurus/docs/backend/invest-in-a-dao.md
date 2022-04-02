---
sidebar_position: 1
---

# As an investor

## Invest in a Dao

As an **investor**, contribute to a DAO initial offering by investing:

### Prerequisites

- You must have enough tokens
- It must me the first time you invest in the DAO
- The funding goal must not have been reached
- You must invest more than the allocated amount per investor
- You must invest after the start date and before the end date of the campaign

You will get a reward according to your invesment

```jsx
   function depositAllocation(uint _amount) external payable onlyInvestor {
        ...
        percentageDistributed[msg.sender] = (userSpentAmount * 100) / fundingGoal;
        ...
      }
```

You will lock your token in the smart contract

```jsx
   function depositAllocation(uint _amount) external payable onlyInvestor {
        ...
        fundingToken.transferFrom(msg.sender, address(this), _amount);
    }
```