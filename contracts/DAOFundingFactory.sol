//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DAOFunding.sol";
import "./CloneFactory.sol";
//import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOFundingFactory is CloneFactory, Ownable {

    DAOFunding[] public children;
    address public masterContractAddress;

    event DAOFundingCreated(address newDAOFundingAddress);

    constructor (address _masterContractAddress) {
        masterContractAddress = _masterContractAddress;
    }

    function setMasterContractAddress(address _masterContractAddress) public onlyOwner {
        masterContractAddress = _masterContractAddress;
    }

    function createDAOFunding(uint256 _x) public onlyOwner {
        address clone = createClone(masterContractAddress);
        DAOFunding(clone).init(_x);
        children.push(DAOFunding(clone));
        emit DAOFundingCreated(clone);
    }
}