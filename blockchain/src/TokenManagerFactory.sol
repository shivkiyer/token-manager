// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {SharedWallet} from "./SharedWallet.sol";

contract TokenManagerFactory {
    event SharedWalletCreated(address indexed wallet);

    constructor() {}

    function createSharedWallet() public {
        SharedWallet sharedWallet = new SharedWallet();
        emit SharedWalletCreated(address(sharedWallet));
    }
}
