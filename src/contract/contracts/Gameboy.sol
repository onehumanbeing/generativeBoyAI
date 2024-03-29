pragma solidity ^0.8.7;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IERC20Permit{
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract GameBoy is ERC721 {
    using Strings for uint256;
    address payable public bot;
    mapping(uint256 => Bounty) public bounties;
    uint256 public nextBountyId = 1;
    uint256[] public activeBounties;

    struct Bounty {
        uint256 bountyAmount;
        uint256 ticketAmount;
        IERC20Permit token;
        address payable creator;
        bytes32 hashedAnswer;
        string ipfsHash;
        bool claimed;
        uint256 salt;
    }

    constructor(address payable _bot)
        ERC721("GameBoy Bounty", "GBB")
    {
        bot = _bot;
    }

    function setBot(address payable _bot) external {
        bot = _bot;
    }

    function createBounty(
    string memory answer,
    IERC20Permit token,
    uint256 bountyAmount,
    uint256 ticketAmount,
    string memory ipfsHash,
    address payable from
) external {
    require(msg.sender == bot, "auth");
    require(bountyAmount > 0, "Bounty amount must be greater than 0");
    
    // Ensure the contract has the necessary allowance to transfer the bounty amount
    require(token.allowance(from, address(this)) >= bountyAmount, "Insufficient allowance");

    uint256 salt = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
    bytes32 hashedAnswer = keccak256(abi.encodePacked(answer, salt.toString()));
    bounties[nextBountyId] = Bounty(
        bountyAmount,
        ticketAmount,
        token,
        from,
        hashedAnswer,
        ipfsHash,
        false,
        salt
    );
    activeBounties.push(nextBountyId);
    nextBountyId++;

    // Transfer the bounty amount to the contract to activate the bounty
    token.transferFrom(from, address(this), bountyAmount);
}

    function permitWithCreateBounty(
        string memory answer, 
        IERC20Permit token, 
        uint256 permitAmount, 
        uint256 ticketAmount,
        uint256 bountyAmount,
        string memory ipfsHash,
        uint256 deadline,
        address payable from,
        uint8 v,
        bytes32 r,
        bytes32 s    
    ) external {
        require(msg.sender == bot, "auth");
        require(bountyAmount > 0, "Bounty amount must be greater than 0");
        token.permit(from, address(this), permitAmount, deadline, v, r, s);
        uint256 salt = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        bytes32 hashedAnswer = keccak256(abi.encodePacked(answer, salt.toString()));
        bounties[nextBountyId] = Bounty(bountyAmount, ticketAmount, token, payable(msg.sender), hashedAnswer, ipfsHash, false, salt);
        activeBounties.push(nextBountyId);
        nextBountyId++;
        // Transfer the bounty amount to the GameBoy contract to activate the bounty
        token.transferFrom(msg.sender, address(this), bountyAmount);
    }

    function verify(uint256 bountyId, string memory answer, address from) external {
        require(msg.sender == bot, "auth");
        Bounty storage bounty = bounties[bountyId];
        require(!bounty.claimed, "Bounty already claimed");
        if (keccak256(abi.encodePacked(answer, bounty.salt.toString())) == bounty.hashedAnswer) {
            bounty.claimed = true;
            require(bounty.token.transfer(from, bounty.bountyAmount), "Token transfer failed");
            // Remove the bounty from the active bounties list
            // for (uint i = 0; i < activeBounties.length; i++) {
            //     if (activeBounties[i] == bountyId) {
            //         activeBounties[i] = activeBounties[activeBounties.length - 1];
            //         activeBounties.pop();
            //         break;
            //     }
            // }
        } else {
            // User pays the ticket price for a wrong answer
            uint256 ticketPrice = bounty.ticketAmount;
            uint256 creatorReward = ticketPrice * 8 / 10;
            uint256 bountyIncrease = ticketPrice / 10;
            uint256 botReward = ticketPrice / 10;
            bounty.token.transferFrom(from, bounty.creator, creatorReward);
            bounty.token.transferFrom(from, bot, botReward);
            bounty.token.transferFrom(from, address(this), bountyIncrease);
            bounty.bountyAmount += bountyIncrease;
        }
    }

    function getActiveBounties() external view returns (Bounty[] memory) {
        Bounty[] memory activeBountyDetails = new Bounty[](activeBounties.length);
        for (uint i = 0; i < activeBounties.length; i++) {
            Bounty storage bounty = bounties[activeBounties[i]];
            activeBountyDetails[i] = Bounty(bounty.bountyAmount, bounty.ticketAmount, bounty.token, bounty.creator, bounty.hashedAnswer, bounty.ipfsHash, bounty.claimed, 0);
        }
        return activeBountyDetails;
    }

    function sendETH(address payable to, uint bountyAmount) internal {
        (bool sent,) = to.call{value: bountyAmount}("");
        require(sent, "Failed to send Ether");
    }

    function permit(
        IERC20Permit token,
        address payable from,
        uint256 permitAmount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(msg.sender == bot, "auth");
        token.permit(from, address(this), permitAmount, deadline, v, r, s);
    }

    fallback() payable external {} // fallback is cheaper than receive by 26 gas

    receive() external payable {} // Receive ether function
}
