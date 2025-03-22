const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RentalAgreement", function () {
  let RentalAgreement;
  let rentalAgreement;
  let landlord;
  let tenant;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    RentalAgreement = await ethers.getContractFactory("RentalAgreement");
    [landlord, tenant, addr2] = await ethers.getSigners();

    // Deploy a new RentalAgreement contract
    rentalAgreement = await RentalAgreement.deploy();
  });

  describe("Creating Agreements", function () {
    it("Should create an agreement correctly", async function () {
      const rentalAmount = ethers.parseEther("0.5");
      const deposit = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60; // 30 days in seconds
      const conditions = "No pets allowed";

      await rentalAgreement.createAgreement(tenant.address, rentalAmount, deposit, duration, conditions);
      
      const agreement = await rentalAgreement.getAgreement(0);
      expect(agreement.tenant).to.equal(tenant.address);
      expect(agreement.landlord).to.equal(landlord.address);
      expect(agreement.rentalAmount).to.equal(rentalAmount);
      expect(agreement.deposit).to.equal(deposit);
      expect(agreement.duration).to.equal(duration);
      expect(agreement.conditions).to.equal(conditions);
      expect(agreement.status).to.equal(0); // Pending status
      
      expect(await rentalAgreement.agreementCount()).to.equal(1);
    });

    it("Should emit AgreementCreated event", async function () {
      const rentalAmount = ethers.parseEther("0.5");
      const deposit = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60; // 30 days in seconds
      const conditions = "No pets allowed";

      await expect(rentalAgreement.createAgreement(tenant.address, rentalAmount, deposit, duration, conditions))
        .to.emit(rentalAgreement, "AgreementCreated")
        .withArgs(0, tenant.address, landlord.address);
    });

    it("Should fail if tenant address is zero", async function () {
      const rentalAmount = ethers.parseEther("0.5");
      const deposit = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60; // 30 days in seconds
      const conditions = "No pets allowed";

      await expect(
        rentalAgreement.createAgreement(ethers.ZeroAddress, rentalAmount, deposit, duration, conditions)
      ).to.be.revertedWith("Invalid tenant address");
    });

    it("Should fail with invalid agreement terms", async function () {
      await expect(
        rentalAgreement.createAgreement(tenant.address, 0, ethers.parseEther("1"), 30 * 24 * 60 * 60, "No pets allowed")
      ).to.be.revertedWith("Invalid agreement terms");
    });
  });

  describe("Activating Agreements", function () {
    beforeEach(async function () {
      const rentalAmount = ethers.parseEther("0.5");
      const deposit = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60; // 30 days in seconds
      const conditions = "No pets allowed";

      await rentalAgreement.createAgreement(tenant.address, rentalAmount, deposit, duration, conditions);
    });

    it("Should activate an agreement correctly", async function () {
      await rentalAgreement.activateAgreement(0);
      
      const agreement = await rentalAgreement.getAgreement(0);
      expect(agreement.status).to.equal(1); // Active status
    });

    it("Should fail if non-landlord tries to activate agreement", async function () {
      await expect(
        rentalAgreement.connect(tenant).activateAgreement(0)
      ).to.be.revertedWith("Only landlord can activate agreement");
    });
  });

  describe("Terminating Agreements", function () {
    beforeEach(async function () {
      const rentalAmount = ethers.parseEther("0.5");
      const deposit = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60; // 30 days in seconds
      const conditions = "No pets allowed";

      await rentalAgreement.createAgreement(tenant.address, rentalAmount, deposit, duration, conditions);
      await rentalAgreement.activateAgreement(0);
    });

    it("Should allow landlord to terminate agreement", async function () {
      await rentalAgreement.terminateAgreement(0);
      
      const agreement = await rentalAgreement.getAgreement(0);
      expect(agreement.status).to.equal(2); // Terminated status
    });

    it("Should allow tenant to terminate agreement", async function () {
      await rentalAgreement.connect(tenant).terminateAgreement(0);
      
      const agreement = await rentalAgreement.getAgreement(0);
      expect(agreement.status).to.equal(2); // Terminated status
    });

    it("Should fail if non-landlord or non-tenant tries to terminate agreement", async function () {
      await expect(
        rentalAgreement.connect(addr2).terminateAgreement(0)
      ).to.be.revertedWith("Only landlord or tenant can terminate agreement");
    });

    it("Should emit AgreementTerminated event", async function () {
      await expect(rentalAgreement.terminateAgreement(0))
        .to.emit(rentalAgreement, "AgreementTerminated")
        .withArgs(0, landlord.address, tenant.address);
    });
  });
}); 