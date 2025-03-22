pragma solidity ^0.8.0;

contract IdentityVerification {
    struct User {
        address userAddress;
        bool isVerified;
        string metadata;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed userAddress, string metadata);
    event UserVerified(address indexed userAddress);

    function registerUser(string memory _metadata) external {
        require(users[msg.sender].userAddress == address(0), "User already registered");

        users[msg.sender] = User({
            userAddress: msg.sender,
            isVerified: false,
            metadata: _metadata
        });

        emit UserRegistered(msg.sender, _metadata);
    }

    function verifyUser(address _user) external {
        User storage user = users[_user];
        require(user.userAddress != address(0), "User not registered");

        user.isVerified = true;
        emit UserVerified(_user);
    }

    function isUserVerified(address _user) external view returns (bool) {
        return users[_user].isVerified;
    }

    function getUser(address _user) external view returns (User memory) {
        return users[_user];
    }
}
