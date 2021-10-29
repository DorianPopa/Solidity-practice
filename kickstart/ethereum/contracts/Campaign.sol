// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));

        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    // Cannot use array because of the nested mapping
    // => array replaced by mapping with incremented key
    uint256 public requestsCount;
    mapping(uint256 => Request) public requests;

    uint256 public approversCount;
    mapping(address => bool) public approvers;

    address public manager;
    uint256 public minimumContribution; // wei

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address managerAddr) {
        manager = managerAddr;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory _description,
        uint256 _value,
        address _recipient
    ) public restricted {
        // Reference a new Request instance inside the mapping
        Request storage newRequest = requests[requestsCount++];
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender] == true); // Require the caller to be a contributor
        require(request.approvals[msg.sender] == false); // Require the caller to be the first time voting this request

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(request.complete == false); // The request should not be already completed
        require(request.approvalCount > (approversCount / 2)); // More than half of the contributors must have approved

        address payable recipient = payable(request.recipient);
        recipient.transfer(request.value);

        request.complete = true;
    }
}
