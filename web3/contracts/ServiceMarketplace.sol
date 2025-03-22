// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRentocoin {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract ServiceMarketplace {
    struct Service {
        uint256 id;
        string name;
        address provider;
        uint256 price;
        bool active;
    }

    struct Booking {
        uint256 id;
        address user;
        uint256 serviceId;
        uint256 amountPaid;
        bool paidWithRentocoin;
        bool completed;
    }

    address public owner;
    IRentocoin public rentocoin;
    uint256 public nextServiceId;
    uint256 public nextBookingId;

    mapping(uint256 => Service) public services;
    mapping(uint256 => Booking) public bookings;

    event ServiceAdded(uint256 serviceId, string name, uint256 price);
    event ServiceUpdated(uint256 serviceId, string name, uint256 price);
    event ServiceDeactivated(uint256 serviceId);
    event BookingMade(uint256 bookingId, uint256 serviceId, address user, bool paidWithRentocoin);
    event BookingCompleted(uint256 bookingId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyProvider(uint256 serviceId) {
        require(services[serviceId].provider == msg.sender, "Only provider can modify this service");
        _;
    }

    constructor(address _rentocoinAddress) {
        owner = msg.sender;
        rentocoin = IRentocoin(_rentocoinAddress);
    }

    function addService(string memory name, uint256 price) external {
        services[nextServiceId] = Service(nextServiceId, name, msg.sender, price, true);
        emit ServiceAdded(nextServiceId, name, price);
        nextServiceId++;
    }

    function updateService(uint256 serviceId, string memory name, uint256 price) external onlyProvider(serviceId) {
        Service storage service = services[serviceId];
        service.name = name;
        service.price = price;
        emit ServiceUpdated(serviceId, name, price);
    }

    function deactivateService(uint256 serviceId) external onlyProvider(serviceId) {
        services[serviceId].active = false;
        emit ServiceDeactivated(serviceId);
    }

    function bookService(uint256 serviceId, bool payWithRentocoin) external payable {
        Service storage service = services[serviceId];
        require(service.active, "Service is not active");

        uint256 amountPaid = service.price;

        if (payWithRentocoin) {
            require(rentocoin.transferFrom(msg.sender, service.provider, amountPaid), "Rentocoin transfer failed");
        } else {
            require(msg.value == amountPaid, "Incorrect payment amount");
            payable(service.provider).transfer(amountPaid);
        }

        bookings[nextBookingId] = Booking(nextBookingId, msg.sender, serviceId, amountPaid, payWithRentocoin, false);
        emit BookingMade(nextBookingId, serviceId, msg.sender, payWithRentocoin);
        nextBookingId++;
    }

    function completeBooking(uint256 bookingId) external {
        Booking storage booking = bookings[bookingId];
        require(msg.sender == services[booking.serviceId].provider, "Only provider can complete the booking");
        require(!booking.completed, "Booking already completed");

        booking.completed = true;
        emit BookingCompleted(bookingId);
    }

    function getService(uint256 serviceId) external view returns (Service memory) {
        return services[serviceId];
    }

    function getBooking(uint256 bookingId) external view returns (Booking memory) {
        return bookings[bookingId];
    }
}