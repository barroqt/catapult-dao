//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// TODO(system): implement logic around DAO (deposit, withdraw, distribute)
contract Investment is Initializable {

    // User status
    address public admin;
    address public investor;

    // Funding round
    uint256 public fundingGoal; // Total campaign target
    uint256 public startDate;
    uint256 public endDate;
    uint256 public userSpentAmount = 0; // final size
    uint256 public allocatedMaxAmount; // initial size
    // uint256 public percentageDistributed;
    // no use case yet, but would be useful to show the max potential token distributed if investors fulfills the allocation
    uint256 public maxPercentageDistributed = (allocatedMaxAmount / fundingGoal) * 100;
    uint256 public daoTokenAllocation = 1000000000000;

    // User balances
    mapping(address => uint) balances;

    // An Allocation has an Investor 
    mapping(address => uint256) public investedAmount; // amount to be replaced with allocation struct
    mapping(address => uint256) public percentageDistributed; // amount to be replaced with allocation struct
    // who already invested to avoid investing twice
    mapping(address => bool) public hasInvested;

    IERC20 public token;

    // TODO: allocation percentage: mapping(address => uint)
   
    function init(uint256 _fundingGoal, uint256 _allocatedMaxAmount, uint256 _startDate, uint256 _endDate, address _token) external initializer {
        investor = msg.sender;
        balances[investor] = investor.balance;
        fundingGoal = _fundingGoal;
        allocatedMaxAmount = _allocatedMaxAmount;
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
        require(userSpentAmount + _amount <= fundingGoal, "Can't invest more than the campaign goal");
        require(userSpentAmount + _amount <= allocatedMaxAmount, "Can't invest more than the allocated amount");
        require(block.timestamp >= startDate, "The campaign has not started yet");
        require(block.timestamp < endDate, "The campaign is over");

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

    // TODO: if finalSize < initialSize : start another round

}