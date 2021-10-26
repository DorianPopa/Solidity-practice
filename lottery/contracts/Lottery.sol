// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;
 
contract Lottery {
    address     public manager;
    address[]   public players;
    
    constructor() {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        // Questionable RNG
        bytes memory seed = abi.encodePacked(
            block.difficulty, 
            block.timestamp, 
            players
        );
        
        return uint(keccak256(seed));
    }
    
    function pickWinner() public restricted {
        require(players.length > 0);
        
        uint index = random() % players.length;
        address payable winner = payable(players[index]);
        winner.transfer(address(this).balance);
        
        players = new address[](0);
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}