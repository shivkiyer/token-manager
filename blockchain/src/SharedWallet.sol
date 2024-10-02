// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

event Withdrawal(address indexed _from, address indexed _to, uint256 amount);

error SharedWallet__ExceededLimit(uint256 requestedAmount, uint256 limit);
error SharedWallet__InsufficientBalance(uint256 requestedAmount);

/**
 * @dev Contract for creating a shared wallet for approved withdrawers.
 *
 * The contract owner can add withdrawers and set withdrawal limits
 * for each of them.
 * An attempt to withdraw over the set limit will revert with an error.
 * An attempt by an unauthorized person to withdraw will revert with an error.
 */
contract SharedWallet is Ownable, AccessControl {
    bytes32 public constant SPENDER = keccak256("SPENDER");
    mapping(address => uint256) public withdrawLimit;
    uint256 private balance;

    constructor() Ownable(_msgSender()) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    receive() external payable {
        balance += msg.value;
    }

    function setWithdrawer(address withdrawer, uint256 limit) public onlyOwner {
        grantRole(SPENDER, withdrawer);
        withdrawLimit[withdrawer] = limit;
    }

    function withdraw(address _to, uint256 amount) public {
        _checkRole(SPENDER, _to);
        if (amount > withdrawLimit[_to]) {
            revert SharedWallet__ExceededLimit({
                requestedAmount: amount,
                limit: withdrawLimit[_to]
            });
        }
        if (amount > balance) {
            revert SharedWallet__InsufficientBalance(amount);
        }
        balance -= amount;
        payable(_to).transfer(amount);
        emit Withdrawal(address(this), _to, amount);
    }

    function closeWallet() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
