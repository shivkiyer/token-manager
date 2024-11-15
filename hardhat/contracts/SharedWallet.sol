// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

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
    uint256 public withdrawLimit;
    uint256 private balance;

    event SharedWallet__Withdrawal(
        address indexed _from,
        address indexed _to,
        uint256 amount
    );

    error SharedWallet__ExceededLimit(uint256 requestedAmount, uint256 limit);
    error SharedWallet__InsufficientBalance(uint256 requestedAmount);

    constructor(
        uint256 _withdrawLimit,
        address _walletOwner
    ) Ownable(_walletOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, _walletOwner);
        withdrawLimit = _withdrawLimit;
    }

    receive() external payable {
        balance += msg.value;
    }

    function setWithdrawer(address withdrawer) public onlyOwner {
        grantRole(SPENDER, withdrawer);
    }

    function withdraw(address _to, uint256 amount) public {
        _checkRole(SPENDER, _to);
        if (amount > withdrawLimit) {
            revert SharedWallet__ExceededLimit({
                requestedAmount: amount,
                limit: withdrawLimit
            });
        }
        if (amount > balance) {
            revert SharedWallet__InsufficientBalance(amount);
        }
        balance -= amount;
        payable(_to).transfer(amount);
        emit SharedWallet__Withdrawal(address(this), _to, amount);
    }

    function closeWallet() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
