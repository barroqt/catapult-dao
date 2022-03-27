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
    uint256 public userSpentAmount = 0; // final size
    uint256 public allocatedMaxAmount; // initial size
    // no use case yet, but would be useful to show the max potential token distributed if investors fulfills the allocation
    uint256 public maxPercentageDistributed;

    // User balances
    mapping(address => uint) balances;

    // An Allocation has an Investor 
    mapping(address => uint256) public investedAmount; // amount to be replaced with allocation struct
    mapping(address => uint256) public percentageDistributed; // amount to be replaced with allocation struct
    // who already invested to avoid investing twice
    mapping(address => bool) public hasInvested;

   
    IERC20 public fundingToken;
    IERC20 public daoToken;
   
    function init(uint256 _fundingGoal, uint256 _allocatedMaxAmount, uint256 _startDate, uint256 _endDate, address _fundingToken, address _daoToken, address _investor, address _daoAddress) external initializer {
        investor = _investor;
        balances[investor] = investor.balance;
        fundingGoal = _fundingGoal;
        allocatedMaxAmount = _allocatedMaxAmount;
        startDate = _startDate;
        endDate = _endDate;
        fundingToken = IERC20(_fundingToken);
        daoToken = IERC20(_daoToken);
        maxPercentageDistributed = (allocatedMaxAmount * 100) / fundingGoal;
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

    function depositAllocation(uint _amount) external payable onlyInvestor {
        require(balances[msg.sender] >= _amount, "Not enough tokens");
        require(!hasInvested[msg.sender], "This user already invested");
        require(userSpentAmount + _amount <= fundingGoal, "Can't invest more than the campaign goal");
        require(userSpentAmount + _amount <= allocatedMaxAmount, "Can't invest more than the allocated amount");
        require(block.timestamp >= startDate, "The campaign has not started yet");
        require(block.timestamp < endDate, "The campaign is over");

        percentageDistributed[msg.sender] = (userSpentAmount * 100) / fundingGoal;
        hasInvested[msg.sender] = true; // We know this address is eligible for rewards
        investedAmount[msg.sender] = _amount; // We know the amount invested by this address
        userSpentAmount += _amount; // The amount of token invested for this campaign
        fundingToken.transferFrom(msg.sender, address(this), _amount);
    }

    // todo : make sure dao has transfered enough tokens
    function distributeToken() external onlyAdmin() {
        require(block.timestamp > endDate, "The campaign is not over");
        require(fundingGoal == fundingToken.balanceOf(address(this)));
        require(hasInvested[investor], "This user did not invest");
        hasInvested[investor] = false;
        uint amountToSend = fundingToken.balanceOf(address(this));
        uint amountToDistribute = (percentageDistributed[investor] * 100) / daoToken.balanceOf(address(this));
        fundingToken.transfer(daoAddress, amountToSend);
        daoToken.transferFrom(msg.sender, investor, amountToDistribute);
    }

    // function extendDuration() external onlyAdmin() {
    //     require(block.timestamp > endDate, "The campaign is not over");
    //     require(userSpentAmount < allocatedMaxAmount, "The final goal had been reached.");

    //     endDate += 7 days;
    //     // TODO: Complete unfinished allocations in a "free for all" manner
    // }

}