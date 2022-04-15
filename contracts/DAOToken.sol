//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("DAOToken", "DAOT") {
        _mint(msg.sender, initialSupply);
    }

    /// @dev Creates `_amount` token to `_to`. Must only be called by the owner (RocketJoeStaking)
    /// @param _to The address that will receive the mint
    /// @param _amount The amount to be minted
    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }
}