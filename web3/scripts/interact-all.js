const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting basic contract interactions...");

  // Load deployment information
  const deploymentInfo = JSON.parse(fs.readFileSync("deployment-info.json", "utf8"));
  const contracts = deploymentInfo.contracts;

  // Get signers
  const [owner, user1, user2, user3] = await hre.ethers.getSigners();
  console.log(`Owner account: ${owner.address}`);
  console.log(`User1 account: ${user1.address}`);
  console.log(`User2 account: ${user2.address}`);
  console.log(`User3 account: ${user3.address}`);

  try {
    // Connect to PropertyListing contract
  const PropertyListing = await hre.ethers.getContractFactory("PropertyListing");
  const propertyListing = PropertyListing.attach(contracts.PropertyListing);
    console.log(`\nConnected to PropertyListing at ${await propertyListing.getAddress()}`);
  
  // 1. Add a property
  console.log("\nAdding a property from user1...");
    const tx1 = await propertyListing.connect(user1).addProperty(
    "Downtown Loft with City Views",
    hre.ethers.parseEther("0.4") // 0.4 ETH per day
  );
    await tx1.wait();
  console.log("User1's property added successfully!");
  
  // 2. Get property count and details
  const propertyCount = await propertyListing.propertyCount();
  console.log(`Total properties listed: ${propertyCount}`);

    // 3. Get property details
    const property = await propertyListing.getProperty(propertyCount - 1n);
    console.log("\nProperty Details:");
    console.log(`ID: ${property.id}`);
    console.log(`Owner: ${property.owner}`);
    console.log(`Description: ${property.description}`);
    console.log(`Price per day: ${hre.ethers.formatEther(property.pricePerDay)} ETH`);
    console.log(`Available: ${property.isAvailable}`);
    
    // 4. Update property
    console.log("\nUpdating property...");
    await propertyListing.connect(user1).updateProperty(
      property.id,
      "Luxury Downtown Loft with Amazing City Views",
      hre.ethers.parseEther("0.5"),
      true
    );
    console.log("Property updated successfully!");
    
    // 5. Get updated property details
    const updatedProperty = await propertyListing.getProperty(property.id);
    console.log("\nUpdated Property Details:");
    console.log(`Description: ${updatedProperty.description}`);
    console.log(`Price per day: ${hre.ethers.formatEther(updatedProperty.pricePerDay)} ETH`);
    
    // Connect to RentalAgreement contract
    const RentalAgreement = await hre.ethers.getContractFactory("RentalAgreement");
    const rentalAgreement = RentalAgreement.attach(contracts.RentalAgreement);
    console.log(`\nConnected to RentalAgreement at ${await rentalAgreement.getAddress()}`);
    
    // 6. Create a rental agreement
  console.log("\nCreating a rental agreement...");
    const rentalAmount = hre.ethers.parseEther("0.5");
    const deposit = hre.ethers.parseEther("1");
    const duration = 30 * 24 * 60 * 60; // 30 days in seconds
    const conditions = "No pets, no smoking, check out by 11am";
    
    const tx2 = await rentalAgreement.connect(user1).createAgreement(
    user2.address, // tenant
    rentalAmount,
    deposit,
    duration,
    conditions
  );
    await tx2.wait();
    
    const agreementCount = await rentalAgreement.agreementCount();
    console.log(`Rental agreement created successfully with ID: ${agreementCount - 1n}`);
    
    // 7. Get agreement details
    const agreement = await rentalAgreement.getAgreement(agreementCount - 1n);
    console.log("\nAgreement Details:");
    console.log(`Tenant: ${agreement.tenant}`);
    console.log(`Landlord: ${agreement.landlord}`);
    console.log(`Rental Amount: ${hre.ethers.formatEther(agreement.rentalAmount)} ETH`);
    console.log(`Deposit: ${hre.ethers.formatEther(agreement.deposit)} ETH`);
    console.log(`Duration: ${agreement.duration.toString()} seconds`);
    console.log(`Status: ${["Pending", "Active", "Terminated"][Number(agreement.status)]}`);
    
    // 8. Activate the agreement
  console.log("\nActivating the agreement...");
    const tx3 = await rentalAgreement.connect(user1).activateAgreement(agreementCount - 1n);
    await tx3.wait();
  console.log("Agreement activated!");

    // 9. Check updated status
    const updatedAgreement = await rentalAgreement.getAgreement(agreementCount - 1n);
    console.log(`Updated status: ${["Pending", "Active", "Terminated"][Number(updatedAgreement.status)]}`);
    
    // 10. Terminate the agreement
    console.log("\nTerminating the agreement (from tenant)...");
    const tx4 = await rentalAgreement.connect(user2).terminateAgreement(agreementCount - 1n);
    await tx4.wait();
    console.log("Agreement terminated!");
    
    // 11. Check final status
    const finalAgreement = await rentalAgreement.getAgreement(agreementCount - 1n);
    console.log(`Final status: ${["Pending", "Active", "Terminated"][Number(finalAgreement.status)]}`);

  console.log("\nAll interactions completed successfully!");
  
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Try to extract more detailed error information
    if (error.data) {
      console.error(`Error data: ${error.data}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 