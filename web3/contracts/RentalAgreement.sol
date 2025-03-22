pragma solidity ^0.8.0;

contract RentalAgreement {
    enum AgreementStatus { Pending, Active, Terminated }

    struct Agreement {
        address tenant;
        address landlord;
        uint256 rentalAmount;
        uint256 deposit;
        uint256 duration; // In seconds
        string conditions;
        AgreementStatus status;
        uint256 startTime;
    }

    mapping(uint256 => Agreement) public agreements;
    uint256 public agreementCount;

    event AgreementCreated(uint256 indexed agreementId, address indexed tenant, address indexed landlord);
    event AgreementTerminated(uint256 indexed agreementId, address indexed landlord, address indexed tenant);

    function createAgreement(address _tenant, uint256 _rentalAmount, uint256 _deposit, uint256 _duration, string memory _conditions) external returns (uint256) {
        require(_tenant != address(0), "Invalid tenant address");
        require(_rentalAmount > 0 && _deposit >= 0 && _duration > 0, "Invalid agreement terms");

        agreements[agreementCount] = Agreement({
            tenant: _tenant,
            landlord: msg.sender,
            rentalAmount: _rentalAmount,
            deposit: _deposit,
            duration: _duration,
            conditions: _conditions,
            status: AgreementStatus.Pending,
            startTime: block.timestamp
        });

        emit AgreementCreated(agreementCount, _tenant, msg.sender);
        return agreementCount++;
    }

    function activateAgreement(uint256 _agreementId) external {
        Agreement storage agreement = agreements[_agreementId];
        require(msg.sender == agreement.landlord, "Only landlord can activate agreement");
        require(agreement.status == AgreementStatus.Pending, "Agreement already active or terminated");

        agreement.status = AgreementStatus.Active;
        agreement.startTime = block.timestamp;
    }

    function terminateAgreement(uint256 _agreementId) external {
        Agreement storage agreement = agreements[_agreementId];
        require(msg.sender == agreement.landlord || msg.sender == agreement.tenant, "Only landlord or tenant can terminate agreement");
        require(agreement.status == AgreementStatus.Active, "Agreement is not active");
        
        agreement.status = AgreementStatus.Terminated;

        emit AgreementTerminated(_agreementId, agreement.landlord, agreement.tenant);
    }

    function getAgreement(uint256 _agreementId) external view returns (Agreement memory) {
        return agreements[_agreementId];
    }
}
