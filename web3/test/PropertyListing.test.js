const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyListing", function () {
  let PropertyListing;
  let propertyListing;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    PropertyListing = await ethers.getContractFactory("PropertyListing");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a new PropertyListing contract
    propertyListing = await PropertyListing.deploy();
  });

  describe("Adding Properties", function () {
    it("Should add a property correctly", async function () {
      await propertyListing.addProperty("Beach house in Miami", ethers.parseEther("0.1"));
      
      const property = await propertyListing.getProperty(0);
      expect(property.id).to.equal(0);
      expect(property.owner).to.equal(owner.address);
      expect(property.description).to.equal("Beach house in Miami");
      expect(property.pricePerDay).to.equal(ethers.parseEther("0.1"));
      expect(property.isAvailable).to.equal(true);
      
      expect(await propertyListing.propertyCount()).to.equal(1);
    });

    it("Should emit PropertyAdded event", async function () {
      await expect(propertyListing.addProperty("Beach house in Miami", ethers.parseEther("0.1")))
        .to.emit(propertyListing, "PropertyAdded")
        .withArgs(0, owner.address);
    });
  });

  describe("Updating Properties", function () {
    beforeEach(async function () {
      await propertyListing.addProperty("Beach house in Miami", ethers.parseEther("0.1"));
    });

    it("Should update a property correctly", async function () {
      await propertyListing.updateProperty(0, "Luxury beach house in Miami", ethers.parseEther("0.2"), false);
      
      const property = await propertyListing.getProperty(0);
      expect(property.description).to.equal("Luxury beach house in Miami");
      expect(property.pricePerDay).to.equal(ethers.parseEther("0.2"));
      expect(property.isAvailable).to.equal(false);
    });

    it("Should fail if non-owner tries to update property", async function () {
      await expect(
        propertyListing.connect(addr1).updateProperty(0, "Hacked property", ethers.parseEther("0"), false)
      ).to.be.revertedWith("Only the owner can update the property");
    });
  });

  describe("Deleting Properties", function () {
    beforeEach(async function () {
      await propertyListing.addProperty("Beach house in Miami", ethers.parseEther("0.1"));
    });

    it("Should delete a property correctly", async function () {
      await propertyListing.deleteProperty(0);
      
      const property = await propertyListing.getProperty(0);
      expect(property.owner).to.equal(ethers.ZeroAddress);
    });

    it("Should fail if non-owner tries to delete property", async function () {
      await expect(
        propertyListing.connect(addr1).deleteProperty(0)
      ).to.be.revertedWith("Only the owner can delete the property");
    });
  });
}); 