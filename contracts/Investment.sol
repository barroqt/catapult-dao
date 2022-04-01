//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// TODO(system): implement logic around DAO (deposit, withdraw, distribute)
contract Investment is Initializable, AccessControl {
    // User status
    address public admin;
    address public investor;
    address public daoAddress;

    // Funding round
    uint256 public fundingGoal; // Total campaign target
    uint256 public startDate;
    uint256 public endDate;

    // User balances
    mapping(address => uint) balances;

    // ---- Allocation ----
    struct Allocation {
        uint256 userSpentAmount; // final size
        uint256 allocatedMaxAmount; // initial size
        uint256 maxPercentageDistributed; // Max potential token distributed
        uint256 percentageDistributed; // Actual percentage of token rewarded
        bool hasInvested; // to avoid investing twice
    }
    Allocation[] public allocations; 

    mapping(address => Allocation) public userToAllocation;

    // ---- Tokens ----
    IERC20 public fundingToken;
    IERC20 public daoToken;
   
    function init(uint256 _fundingGoal, uint256 _startDate, uint256 _endDate, address _fundingToken, address _daoToken, address _investor, address _daoAddress) external initializer {
        // roles
        investor = _investor;
        // campaign duration
        startDate = _startDate;
        endDate = _endDate;
        // balances
        balances[investor] = investor.balance;
        fundingGoal = _fundingGoal;
        // tokens
        fundingToken = IERC20(_fundingToken);
        daoToken = IERC20(_daoToken);
        daoAddress = _daoAddress;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the administrator can do that");
        _;
    }

    modifier onlyInvestor() {
        require(msg.sender == investor, "Only the investor can do that");
        _;
    }

    function createAllocation(uint256 _allocatedMaxAmount, address _investor) external onlyAdmin() {
        require(block.timestamp < startDate, "The funding period has already started");

        Allocation memory newAllocation = Allocation({
            allocatedMaxAmount: _allocatedMaxAmount,
            userSpentAmount: 0,
            maxPercentageDistributed: (_allocatedMaxAmount * 100) / fundingGoal,
            percentageDistributed: 0,
            hasInvested: false
        });
        allocations.push(newAllocation);
        userToAllocation[_investor] = newAllocation;
    }

    function depositAllocation(uint _amount) external payable onlyInvestor() {
        Allocation memory currentUser = userToAllocation[msg.sender];

        require(_amount > 0, "Can't invest 0 token");
        require(balances[msg.sender] >= _amount, "Not enough tokens");
        require(!currentUser.hasInvested, "This user already invested");
        require(currentUser.userSpentAmount + _amount <= fundingGoal, "Can't invest more than the campaign goal");
        require(currentUser.userSpentAmount + _amount <= currentUser.allocatedMaxAmount, "Can't invest more than the allocated amount");
        require(block.timestamp >= startDate, "The campaign has not started yet");
        require(block.timestamp < endDate, "The campaign is over");

        currentUser.percentageDistributed = (currentUser.userSpentAmount * 100) / fundingGoal;
        currentUser.hasInvested = true; // We know this address is eligible for rewards
        currentUser.userSpentAmount += _amount; // The amount of token invested for this campaign
        fundingToken.transferFrom(msg.sender, address(this), _amount);
    }

    // todo : make sure dao has transfered enough tokens
    // todo : handle array of addresses
    function distributeToken() external onlyAdmin() {
        require(block.timestamp > endDate, "The campaign is not over");
        require(fundingGoal == fundingToken.balanceOf(address(this)));
        require(userToAllocation[investor].hasInvested, "This user did not invest");

        userToAllocation[investor].hasInvested = false;
        uint amountToSend = fundingToken.balanceOf(address(this));
        uint amountToDistribute = (userToAllocation[investor].percentageDistributed * 100) / daoToken.balanceOf(address(this));
        fundingToken.transfer(daoAddress, amountToSend);
        daoToken.transferFrom(msg.sender, investor, amountToDistribute);
    }

    function extendDuration() external onlyAdmin() {
        require(block.timestamp > endDate, "The campaign is not over");
        require(userToAllocation[msg.sender].userSpentAmount < userToAllocation[msg.sender].allocatedMaxAmount, "The final goal had been reached.");

        endDate += 7 days;
        // TODO: Complete unfinished allocations in a "free for all" manner
    }
}