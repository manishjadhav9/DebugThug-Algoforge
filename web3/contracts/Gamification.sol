pragma solidity ^0.8.0;

contract Gamification {
    struct User {
        uint256 rentocoinBalance;
        uint256 xp;
        string[] badges;
    }

    mapping(address => User) public users;
    uint256 public constant REWARD_MULTIPLIER = 10;  // XP to Rentocoin conversion ratio

    event RentocoinEarned(address indexed user, uint256 amount);
    event XPAdded(address indexed user, uint256 xp);
    event BadgeAwarded(address indexed user, string badge);

    function addXP(address _user, uint256 _xp) external {
        users[_user].xp += _xp;
        users[_user].rentocoinBalance += _xp / REWARD_MULTIPLIER;

        emit XPAdded(_user, _xp);
        emit RentocoinEarned(_user, _xp / REWARD_MULTIPLIER);
    }

    function awardBadge(address _user, string memory _badge) external {
        users[_user].badges.push(_badge);
        emit BadgeAwarded(_user, _badge);
    }

    function getUserInfo(address _user) external view returns (uint256, uint256, string[] memory) {
        User memory user = users[_user];
        return (user.rentocoinBalance, user.xp, user.badges);
    }

    function redeemRentocoin(uint256 _amount) external {
        require(users[msg.sender].rentocoinBalance >= _amount, "Insufficient Rentocoin balance");

        users[msg.sender].rentocoinBalance -= _amount;
        // Handle redemption logic (e.g., grant access to services or benefits)
    }
}
