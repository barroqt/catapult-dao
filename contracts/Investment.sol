//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// TODO(system): implement logic around DAO (deposit, withdraw, distribute)
contract Investment is Initializable, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant INVESTOR_ROLE = keccak256("INVESTOR_ROLE");


    address public admin;
    uint256 public fundingGoal;
    address public fundingToken;
    uint256 public startDate;
    uint256 public endDate;

    Allocation[] public allocations;
    // investor key => allocations index
    mapping(address => uint) public allocationsMap;

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

            _setupRole(ADMIN_ROLE, admin);
    }

    struct Allocation {
        uint256 allocationSize;
        address investor;
        uint256 fundedSize;
    }

    // caller can be anyone
    function createAllocation(
            address _investor, 
            uint256 _allocationSize
        ) public returns (Allocation memory) {
        // Check Role
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an Admin");

        Allocation memory alloc = Allocation({
            investor: _investor,
            allocationSize: _allocationSize,
            fundedSize: 0
        });
        uint idxLength = allocations.length;
        allocations.push(alloc);
        allocationsMap[_investor] = idxLength;
        return alloc;
    }

    

}