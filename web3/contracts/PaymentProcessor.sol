pragma solidity ^0.8.0;

contract PaymentProcessor {
    struct Payment {
        uint256 amount;
        address tenant;
        address landlord;
        bool isDeposit;
        bool refunded;
    }

    mapping(uint256 => Payment) public payments;
    uint256 public paymentCount;

    event PaymentMade(uint256 indexed paymentId, address indexed tenant, address indexed landlord, uint256 amount, bool isDeposit);
    event DepositRefunded(uint256 indexed paymentId, address indexed tenant);

    function makePayment(address _landlord, bool _isDeposit) external payable returns (uint256) {
        require(msg.value > 0, "Payment amount must be greater than zero");

        payments[paymentCount] = Payment({
            amount: msg.value,
            tenant: msg.sender,
            landlord: _landlord,
            isDeposit: _isDeposit,
            refunded: false
        });

        emit PaymentMade(paymentCount, msg.sender, _landlord, msg.value, _isDeposit);

        return paymentCount++;
    }

    function releasePayment(uint256 _paymentId) external {
        Payment storage payment = payments[_paymentId];
        require(msg.sender == payment.landlord, "Only landlord can release payment");
        require(!payment.refunded, "Payment already refunded");

        payable(payment.landlord).transfer(payment.amount);
    }

    function refundDeposit(uint256 _paymentId) external {
        Payment storage payment = payments[_paymentId];
        require(msg.sender == payment.landlord, "Only landlord can initiate a refund");
        require(payment.isDeposit, "Not a deposit");
        require(!payment.refunded, "Deposit already refunded");

        payment.refunded = true;
        payable(payment.tenant).transfer(payment.amount);

        emit DepositRefunded(_paymentId, payment.tenant);
    }

    function getPayment(uint256 _paymentId) external view returns (Payment memory) {
        return payments[_paymentId];
    }
}
