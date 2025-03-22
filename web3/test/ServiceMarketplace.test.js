const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ServiceMarketplace", function () {
  let rentocoin;
  let serviceMarketplace;
  let owner;
  let provider;
  let user;
  
  const SERVICE_NAME = "Home Cleaning";
  const SERVICE_PRICE = ethers.parseEther("0.1"); // 0.1 ETH
  const INITIAL_SUPPLY = 1000000; // 1 million tokens
  
  beforeEach(async function () {
    // Get signers
    [owner, provider, user] = await ethers.getSigners();
    
    // Deploy Rentocoin
    const Rentocoin = await ethers.getContractFactory("Rentocoin");
    rentocoin = await Rentocoin.deploy(INITIAL_SUPPLY);
    
    // Deploy ServiceMarketplace
    const ServiceMarketplace = await ethers.getContractFactory("ServiceMarketplace");
    serviceMarketplace = await ServiceMarketplace.deploy(await rentocoin.getAddress());
    
    // Transfer some Rentocoin to the user
    await rentocoin.transfer(user.address, ethers.parseEther("1000"));
  });
  
  describe("Service Management", function () {
    it("Should allow adding a new service", async function () {
      await serviceMarketplace.connect(provider).addService(SERVICE_NAME, SERVICE_PRICE);
      
      const service = await serviceMarketplace.services(0);
      expect(service.name).to.equal(SERVICE_NAME);
      expect(service.provider).to.equal(provider.address);
      expect(service.price).to.equal(SERVICE_PRICE);
      expect(service.active).to.be.true;
    });
    
    it("Should allow updating a service", async function () {
      await serviceMarketplace.connect(provider).addService(SERVICE_NAME, SERVICE_PRICE);
      
      const NEW_NAME = "Premium Home Cleaning";
      const NEW_PRICE = ethers.parseEther("0.2");
      
      await serviceMarketplace.connect(provider).updateService(0, NEW_NAME, NEW_PRICE);
      
      const service = await serviceMarketplace.services(0);
      expect(service.name).to.equal(NEW_NAME);
      expect(service.price).to.equal(NEW_PRICE);
    });
    
    it("Should allow deactivating a service", async function () {
      await serviceMarketplace.connect(provider).addService(SERVICE_NAME, SERVICE_PRICE);
      await serviceMarketplace.connect(provider).deactivateService(0);
      
      const service = await serviceMarketplace.services(0);
      expect(service.active).to.be.false;
    });
    
    it("Should prevent non-providers from updating services", async function () {
      await serviceMarketplace.connect(provider).addService(SERVICE_NAME, SERVICE_PRICE);
      
      await expect(
        serviceMarketplace.connect(user).updateService(0, "New Name", SERVICE_PRICE)
      ).to.be.revertedWith("Only provider can modify this service");
    });
  });
  
  describe("Booking Services", function () {
    beforeEach(async function () {
      await serviceMarketplace.connect(provider).addService(SERVICE_NAME, SERVICE_PRICE);
    });
    
    it("Should allow booking with ETH", async function () {
      const providerBalanceBefore = await ethers.provider.getBalance(provider.address);
      
      await serviceMarketplace.connect(user).bookService(0, false, { value: SERVICE_PRICE });
      
      const providerBalanceAfter = await ethers.provider.getBalance(provider.address);
      expect(providerBalanceAfter - providerBalanceBefore).to.equal(SERVICE_PRICE);
      
      const booking = await serviceMarketplace.bookings(0);
      expect(booking.user).to.equal(user.address);
      expect(booking.serviceId).to.equal(0);
      expect(booking.amountPaid).to.equal(SERVICE_PRICE);
      expect(booking.paidWithRentocoin).to.be.false;
      expect(booking.completed).to.be.false;
    });
    
    it("Should allow booking with Rentocoin", async function () {
      // Approve the marketplace to spend user's Rentocoin
      await rentocoin.connect(user).approve(await serviceMarketplace.getAddress(), SERVICE_PRICE);
      
      const providerBalanceBefore = await rentocoin.balanceOf(provider.address);
      
      await serviceMarketplace.connect(user).bookService(0, true);
      
      const providerBalanceAfter = await rentocoin.balanceOf(provider.address);
      expect(providerBalanceAfter - providerBalanceBefore).to.equal(SERVICE_PRICE);
      
      const booking = await serviceMarketplace.bookings(0);
      expect(booking.paidWithRentocoin).to.be.true;
    });
    
    it("Should allow providers to complete bookings", async function () {
      await serviceMarketplace.connect(user).bookService(0, false, { value: SERVICE_PRICE });
      await serviceMarketplace.connect(provider).completeBooking(0);
      
      const booking = await serviceMarketplace.bookings(0);
      expect(booking.completed).to.be.true;
    });
    
    it("Should prevent non-providers from completing bookings", async function () {
      await serviceMarketplace.connect(user).bookService(0, false, { value: SERVICE_PRICE });
      
      await expect(
        serviceMarketplace.connect(user).completeBooking(0)
      ).to.be.revertedWith("Only provider can complete the booking");
    });
  });
}); 