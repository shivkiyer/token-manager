// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {TokenManagerFactory} from "./../src/TokenManagerFactory.sol";

contract TokenManagerFactoryScript is Script {
    TokenManagerFactory public tokenManagerFactory;

    function setUp() public {}

    function run() public returns (TokenManagerFactory) {
        vm.startBroadcast();
        tokenManagerFactory = new TokenManagerFactory();
        vm.stopBroadcast();
        return tokenManagerFactory;
    }
}
