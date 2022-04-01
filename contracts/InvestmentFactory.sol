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
        uint256 startDate,
        uint256 endDate,
        address fundingToken,
        address daoToken,
        address investor,
        address daoAddress
        ) public onlyOwner {
        address clone = createClone(masterContractAddress);
        Investment(clone).init(
            fundingGoal,startDate,endDate,fundingToken, daoToken, investor, daoAddress
        );
        investments.push(Investment(clone));
        emit InvestmentCreated(clone);
    }
}