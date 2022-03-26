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

    // uint256 public maxPercentageDistributed = (allocatedMaxAmount / fundingGoal) * 100;
    uint256 public daoTokenAllocation = 1000000000000;

    // // 
    // // User balances
    // mapping(address => uint) balances;

    // // An Allocation has an Investor 
    // mapping(address => uint256) public investedAmount; // amount to be replaced with allocation struct
    // mapping(address => uint256) public percentageDistributed; // amount to be replaced with allocation struct
    // // who already invested to avoid investing twice
    // mapping(address => bool) public hasInvested;

    // IERC20 public token;


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

    /**
    TODO: msg.sender is Investor.
    Cehcks
    1. check role (only ROLE INVESTOR can use this. )
    2. check against Investor's alloc array (if empty throw)
    3. check Investment's start / end date.
    4. check amount vs allocation size (over)

    Send money
    1. update Investor Allocation fundedSize
    2. 
     */
    function depositAllocation(uint _amount, address _to) external payable {
        require(hasRole(INVESTOR_ROLE, msg.sender), "Caller is not an Investor");

        // Check user balance
        require(balances[msg.sender] >= _amount, "Not enough tokens");

        // TODO: need to check if investor aaddress is in map
        investorIdx = allocationsMap[msg.sender];
        Allocation investorAlloc = allocations[investorIdx];


        // require(!hasInvested[msg.sender], "This user already invested");
        if (_amount + investorAlloc.fundedSize > investorAlloc.allocationSize) {
            require(userSpentAmount + _amount <= fundingGoal, "Cannot overfund");
        }
        // require(userSpentAmount + _amount <= allocatedMaxAmount, "Can't invest more than the allocated amount");
        require(block.timestamp < startDate, "The campaign has not started yet");
        require(block.timestamp > endDate, "The campaign is over");



        percentageDistributed[msg.sender] = (userSpentAmount / fundingGoal) * 100;
        hasInvested[msg.sender] = true; // We know this address is eligible for rewards
        investedAmount[msg.sender] = _amount; // We know the amount invested by this address
        userSpentAmount += _amount; // The amount of token invested for this campaign
        token.transferFrom(msg.sender, _to, _amount);
    }

    // todo : make sure dao has transfered enough tokens
    function distributeToken(address[] memory _investors) external onlyAdmin() {
        require(block.timestamp > endDate, "The campaign is not over");
        for (uint i = 0; i < _investors.length; i++) {
            require(hasInvested[_investors[i]], "This user did not invest");
            hasInvested[_investors[i]] = false;
            uint amountToSend = (percentageDistributed[_investors[i]] / 100) * daoTokenAllocation;
            token.transferFrom(msg.sender, _investors[i], amountToSend);
        }
    }

}