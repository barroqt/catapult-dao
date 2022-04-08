//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Investment is Initializable, AccessControl {
    // User status
    address public admin;
    address public investor;

    // campaign info
    struct CampaignInfo {
        string _name;
        string _description;

        uint256 fundingGoal; // Total campaign target
        uint256 startDate; // Funding campaign start date
        uint256 endDate; // Funding campaign end date
        IERC20 daoToken; // Token airdroped to investors
        uint256 totalInvestedAmount;

        address daoAddress; // external DAO contract
        address[] investors; // make a list of all the investors for the campaign
    }
    CampaignInfo public campaign;

    // User info
    struct UserInfo {
        uint256 investedAmount; // Amount of funding tokens invested by user
        bool hasInvested; // who already invested to avoid investing twice
    }
    mapping(address => UserInfo) public getUserInfo;

    IERC20 public fundingToken;
   
    function init(
        address _admin,
        string memory _name,
        string memory _description,
        uint256 _fundingGoal,
        uint256 _startDate,
        uint256 _endDate,
        address _daoToken,
        address _daoAddress,
        address _fundingToken
    ) external initializer {
        admin = _admin;
        address[] memory initAddressList;

        campaign = CampaignInfo({
            _name: _name,
            _description: _description,
            fundingGoal: _fundingGoal,
            startDate: _startDate,
            endDate: _endDate,
            daoToken: IERC20(_daoToken),
            totalInvestedAmount: 0,
            daoAddress: _daoAddress,
            investors: initAddressList
        });
        fundingToken = IERC20(_fundingToken);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the administrator can do that");
        _;
    }

    // modifier onlyInvestor() {
    //     require(msg.sender == investor, "Only the investor can do that");
    //     _;
    // }

    function depositAllocation(uint _amount) external payable {
        UserInfo memory user = getUserInfo[msg.sender];
        uint investorIdx = campaign.investors.length;

        require(_amount > 0, "Can't invest 0 token");
        require(msg.sender.balance >= _amount, "Not enough tokens");
        require(!user.hasInvested, "This user already invested");
        require(
            campaign.totalInvestedAmount + _amount <= campaign.fundingGoal,
            "Can't invest more than the campaign goal"
        );
        require(block.timestamp >= campaign.startDate, "The campaign has not started yet");
        require(block.timestamp < campaign.endDate, "The campaign is over");

        campaign.investors[investorIdx] = msg.sender; // Add this user to the list of investors for the current campaign
        user.hasInvested = true; // Add this user to the list of investors for the current campaign
        user.investedAmount += _amount; // The amount of token invested for this campaign
        campaign.totalInvestedAmount += _amount; // increase the total amount of token this campaign has received
        fundingToken.transferFrom(msg.sender, address(this), _amount); // Deposit in the smart contract
    }

    function amountToDistribute(uint256 _investedAmount) internal view returns(uint) {
        uint _percentageDistributed = (_investedAmount * 100) / campaign.fundingGoal; // % received as the reward is calculated after the campaign ends
        uint _amountToDistribute = (_percentageDistributed * 100) / campaign.daoToken.balanceOf(address(this));
        return _amountToDistribute;
    }

    // todo : make sure dao has transfered enough tokens
    // Admin sends the DAO token to the investors
    function distributeToken() external onlyAdmin() {
        require(block.timestamp > campaign.endDate, "The campaign is not over");
        require(campaign.fundingGoal == fundingToken.balanceOf(address(this)));

        // Loops through everyone that has invested in this campaign
        for (uint i = 0; i < campaign.investors.length; i++) {
            address _currentInvestor = campaign.investors[i];
            UserInfo memory _investorInfo = getUserInfo[_currentInvestor];

            if (_investorInfo.hasInvested) {
                uint _amountToDistribute = amountToDistribute(_investorInfo.investedAmount);
                
                campaign.daoToken.transferFrom(address(this), _currentInvestor, _amountToDistribute);
            }
        }
    }

    function extendDuration() external onlyAdmin() {
        require(block.timestamp > campaign.endDate, "The campaign is not over");
        require(
            campaign.totalInvestedAmount >= campaign.fundingGoal,
            "The final goal has already been reached."
        );

        campaign.endDate += 7 days;
    }
}