pragma solidity ^0.8.0;

contract DisputeResolution {
    enum DisputeStatus { Open, Resolved, Escalated }

    struct Dispute {
        uint256 agreementId;
        address complainant;
        address defendant;
        string reason;
        DisputeStatus status;
        uint256 escrowAmount;
    }

    mapping(uint256 => Dispute) public disputes;
    uint256 public disputeCount;

    event DisputeCreated(uint256 indexed disputeId, uint256 indexed agreementId, address indexed complainant);
    event DisputeResolved(uint256 indexed disputeId, address indexed resolver);
    event DisputeEscalated(uint256 indexed disputeId);

    function createDispute(uint256 _agreementId, address _defendant, string memory _reason) external payable returns (uint256) {
        require(msg.value > 0, "Escrow amount required");
        
        disputes[disputeCount] = Dispute({
            agreementId: _agreementId,
            complainant: msg.sender,
            defendant: _defendant,
            reason: _reason,
            status: DisputeStatus.Open,
            escrowAmount: msg.value
        });

        emit DisputeCreated(disputeCount, _agreementId, msg.sender);

        return disputeCount++;
    }

    function resolveDispute(uint256 _disputeId, address _winner) external {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.status == DisputeStatus.Open, "Dispute already resolved or escalated");

        dispute.status = DisputeStatus.Resolved;
        payable(_winner).transfer(dispute.escrowAmount);

        emit DisputeResolved(_disputeId, msg.sender);
    }

    function escalateDispute(uint256 _disputeId) external {
        Dispute storage dispute = disputes[_disputeId];
        require(msg.sender == dispute.complainant || msg.sender == dispute.defendant, "Only involved parties can escalate");
        require(dispute.status == DisputeStatus.Open, "Dispute already resolved or escalated");

        dispute.status = DisputeStatus.Escalated;
        emit DisputeEscalated(_disputeId);
    }

    function getDispute(uint256 _disputeId) external view returns (Dispute memory) {
        return disputes[_disputeId];
    }
}
