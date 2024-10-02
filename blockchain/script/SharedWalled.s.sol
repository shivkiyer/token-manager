// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {SharedWallet} from "./../src/SharedWallet.sol";

contract SharedWalletScript is Script {
    SharedWallet public sharedWallet;

    function setUp() public {}

    function run() public returns(SharedWallet) {
        vm.startBroadcast();
        sharedWallet = new SharedWallet();
        vm.stopBroadcast();
        return sharedWallet;
    }
}