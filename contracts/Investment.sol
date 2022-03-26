//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// TODO(system): implement logic around DAO (deposit, withdraw, distribute)
contract Investment is Initializable, AccessControl {

    address public admin;
    uint256 public fundingGoal;
    address public fundingToken;
    uint256 public startDate;
    uint256 public endDate;

    Allocation[] public allocations;

    function init(
        address _admin,
        uint256 _fundingGoal,
        address _fundingToken,
        uint256 _startDate,
        uint256 _endDate
        ) external initializer {
        admin = _admin;
        fundingGoal = _fundingGoal;
        fundingToken = _fundingToken;
        startDate = _startDate;
        endDate = _endDate;
    }

    struct Allocation {
        uint256 allocationSize;
        address investor;
        uint256 fundedSize;
    }

    function createAllocations(address investor, uint256 allocationSize ) private {

    }
}