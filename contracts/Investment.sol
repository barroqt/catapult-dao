//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

// TODO(system): implement logic around DAO (deposit, withdraw, distribute)
contract Investment is Initializable {

    // User status
    address public admin;
    address public investor;

    // keeps track of processed campaigns
    uint256 campaignId; // Do we need this?
    mapping(uint256 => bool) public processedCampaigns;

    // Funding round
    uint256 public fundingGoal;
    uint256 public startDate; 
    uint256 public endDate;
    uint256 public totalAllocatedAmount = 0;

    // User balances
    mapping(address => uint) balances;

    // An Allocation has an Investor 
    mapping(address => uint256) public investedAmount;
    // who already invested to avoid investing twice
    mapping(address => bool) public hasInvested;

    IERC20 public token;

    // TODO: allocation percentage: mapping(address => uint)
   
   // use timestamp startDate:1648196138 (2022-03-25 09:15:38) endDate:1648624538 (2022-03-30 09:15:38) for passing later checks
    function init(uint256 _fundingGoal, uint256 _startDate, uint256 _endDate, address _token) external initializer {
        investor = msg.sender;
        balances[investor] = investor.balance;
        fundingGoal = _fundingGoal;
        startDate = _startDate;
        endDate = _endDate;
        token = IERC20(_token);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the administrator can do that");
        _;
    }

    function depositAllocation(uint _amount, address _to) external payable {
        require(balances[msg.sender] >= _amount, "Not enough tokens");
        require(!hasInvested[msg.sender], "This user already invested");
        require(totalAllocatedAmount + _amount <= fundingGoal, "Can't invest more than the targeted amount");
        require(block.timestamp > startDate, "The campaign has not started yet");
        require(block.timestamp < endDate, "The campaign is over");

        hasInvested[msg.sender] = true; // We know this address is eligible for rewards
        investedAmount[msg.sender] = _amount; // We know the amount invested by this address
        totalAllocatedAmount += _amount; // The amount of token invested for this campaign
        token.transferFrom(msg.sender, _to, _amount);
    }
    
    function sendRewards(uint _amount, address _to) external onlyAdmin() {
        require(block.timestamp > endDate, "The campaign is not over");
        require(hasInvested[_to], "This user did not invest");
        hasInvested[msg.sender] = false;
        // TODO add percentage reward
        token.transferFrom(msg.sender, _to, _amount);
    }
}