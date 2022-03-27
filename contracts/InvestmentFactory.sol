//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Investment.sol";
import "./CloneFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvestmentFactory is CloneFactory, Ownable {

    Investment[] public investments;
    address public masterContractAddress;

    event InvestmentCreated(address newInvestmentAddress);

    constructor (address _masterContractAddress) {
        masterContractAddress = _masterContractAddress;
    }

    function setMasterContractAddress(address _masterContractAddress) public onlyOwner {
        masterContractAddress = _masterContractAddress;
    }

    function createDAOFunding(
        uint256 fundingGoal,
        uint256 allocatedMaxAmount,
        uint256 startDate,
        uint256 endDate,
        address fundingToken
        ) public onlyOwner {
        address clone = createClone(masterContractAddress);
        Investment(clone).init(
            fundingGoal,allocatedMaxAmount,startDate,endDate,fundingToken
            );
        investments.push(Investment(clone));
        emit InvestmentCreated(clone);
    }
}