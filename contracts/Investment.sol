//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// TODO(system): implement logic around DAO (deposit, withdraw, distribute)
contract Investment is Initializable {

    address public admin;

    function init(address _admin) external initializer {
        admin = _admin;
    }

    function setX(uint256 _x) external {
        x = _x;
    }
}