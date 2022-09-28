//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./TokenNuke.sol";

error TransferFailed();


contract Staking is ReentrancyGuard {
    TokenNuke public nuke_Token;
    uint256 public total_Supply;
    address public owner;
    mapping(address => uint256) public stakersEth;
    mapping(address => uint256) public rewardAmount;
    mapping(address => uint256) public stakingBal;
    mapping(address => uint256) public depositTime;
    mapping(address => bool) public isStaking;

    constructor(address _nuke_Token) {
        nuke_Token = TokenNuke(_nuke_Token);
        owner = msg.sender;
    }

    function buyToken() public payable {
        require(msg.value == 0.01 ether, "Amount must be 0.01 ethers");
        stakersEth[msg.sender] = stakersEth[msg.sender] + msg.value;
        nuke_Token.transfer(msg.sender, 100);
    }

    function stakeToken(uint256 _amount) external nonReentrant {
        require(
            nuke_Token.balanceOf(msg.sender) >= 100,
            "Not enough staking Balance"
        );
        depositTime[msg.sender] = block.timestamp;
        total_Supply += _amount;
        stakingBal[msg.sender] += _amount;
        bool success = nuke_Token.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        if (!success) revert TransferFailed();
        isStaking[msg.sender] = true;
    }

    function withdraw(uint256 _amount) external payable nonReentrant {
        require(stakingBal[msg.sender] >= _amount, "Not enough token");
        stakingBal[msg.sender] -= _amount;
        total_Supply -= _amount;
        bool success = nuke_Token.transfer(msg.sender, _amount);
        if (!success) revert TransferFailed();
      /*   payable(msg.sender).transfer(stakersEth[msg.sender]);
        stakersEth[msg.sender] = 0; */
        rewardCount();
        depositTime[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    function rewardCount() public {
        require(isStaking[msg.sender], "Not staking");
        uint256 amt;
        uint256 rewardTime = block.timestamp - depositTime[msg.sender];
        if (rewardTime >= 100) amt = rewardTime / 50;
        rewardAmount[msg.sender] = amt;
    }

    function claimReward() public {
        require(!isStaking[msg.sender], "Still Staking!!");
        nuke_Token.transfer(msg.sender, rewardAmount[msg.sender]);
        rewardAmount[msg.sender] = 0;
    }
}
