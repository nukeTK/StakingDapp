// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenNuke is ERC20 {
    constructor() ERC20("Token Nuke", "TTK") {
        _mint(msg.sender,1000 );
    }
}