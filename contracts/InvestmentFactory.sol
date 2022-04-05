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
//address _daoToken, address _investor, address _daoAddress
    function createDAOFunding(
        address fundingToken,
        address investor
        ) public onlyOwner {
        address clone = createClone(masterContractAddress);
        Investment(clone).init(
            fundingToken, investor
        );
        investments.push(Investment(clone));
        emit InvestmentCreated(clone);
    }
}