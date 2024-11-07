// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {SharedWallet} from "./SharedWallet.sol";

contract TokenManagerFactory {
    event SharedWalletCreated(address indexed wallet);

    constructor() {}

    function createSharedWallet(uint256 _withdrawalLimit) public {
        SharedWallet sharedWallet = new SharedWallet(_withdrawalLimit);
        emit SharedWalletCreated(address(sharedWallet));
    }
}
