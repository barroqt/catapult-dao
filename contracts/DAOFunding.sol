//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// this contract will hold all the logic around DAO (deposit, withdraw, distribute)
contract DAOFunding is Initializable {

    uint256 public x;

    function init(uint256 _x) external initializer {
        x = _x;
    }

    function setX(uint256 _x) external {
        x = _x;
    }
}