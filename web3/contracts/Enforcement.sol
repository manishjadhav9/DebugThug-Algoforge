pragma solidity ^0.8.0;

contract Enforcement {
    struct Agreement {
        uint256 agreementId;
        address tenant;
        address landlord;
        uint256 startDate;
        uint256 endDate;
        bool isTerminated;
    }

    mapping(uint256 => Agreement) public agreements;
    mapping(address => bool) public blacklisted;
    uint256 public agreementCount;

    event AgreementCreated(uint256 indexed agreementId, address indexed tenant, address indexed landlord);
    event AgreementTerminated(uint256 indexed agreementId);
    event UserBlacklisted(address indexed user);

    function createAgreement(address _tenant, uint256 _startDate, uint256 _endDate) external returns (uint256) {
        require(_startDate < _endDate, "Invalid dates");
        require(!blacklisted[_tenant], "Tenant is blacklisted");

        agreements[agreementCount] = Agreement({
            agreementId: agreementCount,
            tenant: _tenant,
            landlord: msg.sender,
            startDate: _startDate,
            endDate: _endDate,
            isTerminated: false
        });

        emit AgreementCreated(agreementCount, _tenant, msg.sender);
        return agreementCount++;
    }

    function terminateAgreement(uint256 _agreementId) external {
        Agreement storage agreement = agreements[_agreementId];
        require(msg.sender == agreement.landlord, "Only the landlord can terminate the agreement");
        require(!agreement.isTerminated, "Agreement already terminated");

        agreement.isTerminated = true;
        emit AgreementTerminated(_agreementId);
    }

    function blacklistUser(address _user) external {
        blacklisted[_user] = true;
        emit UserBlacklisted(_user);
    }

    function isUserBlacklisted(address _user) external view returns (bool) {
        return blacklisted[_user];
    }
}
