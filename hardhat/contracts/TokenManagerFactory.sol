// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Context} from '@openzeppelin/contracts/utils/Context.sol';
import {SharedWallet} from './SharedWallet.sol';

contract TokenManagerFactory is Context {
    event SharedWalletCreated(address indexed wallet);

    constructor() {}

    function createSharedWallet(uint256 _withdrawalLimit) public {
        SharedWallet sharedWallet = new SharedWallet(_withdrawalLimit, _msgSender());
        emit SharedWalletCreated(address(sharedWallet));
    }
}
