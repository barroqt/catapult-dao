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
            string memory name,
            string memory description,
            uint256 fundingGoal,
            uint256 startDate,
            uint256 endDate,
            address daoToken,
            address daoAddress,
            address fundingToken
        ) public onlyOwner {
        address clone = createClone(masterContractAddress);
        address admin = msg.sender;
        Investment(clone).init(
            admin,name,description,fundingGoal,startDate,endDate,daoToken,daoAddress,fundingToken
        );
        investments.push(Investment(clone));
        emit InvestmentCreated(clone);
    }
}