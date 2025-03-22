const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting contract interaction...");

  // Load deployment information
  const deploymentInfo = JSON.parse(fs.readFileSync("deployment-info.json", "utf8"));
  const contracts = deploymentInfo.contracts;

  // Get signers
  const [owner, user1, user2] = await hre.ethers.getSigners();
  console.log(`Owner account: ${owner.address}`);
  console.log(`User1 account: ${user1.address}`);
  console.log(`User2 account: ${user2.address}`);

  // Connect to PropertyListing contract
  const PropertyListing = await hre.ethers.getContractFactory("PropertyListing");
  const propertyListing = PropertyListing.attach(contracts.PropertyListing);
  console.log(`Connected to PropertyListing at ${await propertyListing.getAddress()}`);

  // Connect to RentalAgreement contract
  const RentalAgreement = await hre.ethers.getContractFactory("RentalAgreement");
  const rentalAgreement = RentalAgreement.attach(contracts.RentalAgreement);
  console.log(`Connected to RentalAgreement at ${await rentalAgreement.getAddress()}`);

  // 1. Add a property to the listing
  console.log("\nAdding a property to the listing...");
  const tx1 = await propertyListing.addProperty(
    "Luxury Beachfront Villa with Pool",
    hre.ethers.parseEther("0.5") // 0.5 ETH per day
  );
  await tx1.wait();
  console.log("Property added successfully!");

  // 2. Get the property details
  console.log("\nGetting property details...");
  const property = await propertyListing.getProperty(0);
  console.log(`Property ID: ${property.id}`);
  console.log(`Owner: ${property.owner}`);
  console.log(`Description: ${property.description}`);
  console.log(`Price per day: ${hre.ethers.formatEther(property.pricePerDay)} ETH`);
  console.log(`Available: ${property.isAvailable}`);

  // 3. Add another property from user1
  console.log("\nAdding a property from user1...");
  const tx2 = await propertyListing.connect(user1).addProperty(
    "Cozy Mountain Cabin with Fireplace",
    hre.ethers.parseEther("0.3") // 0.3 ETH per day
  );
  await tx2.wait();
  console.log("User1's property added successfully!");

  // 4. Get property count
  const propertyCount = await propertyListing.propertyCount();
  console.log(`\nTotal properties listed: ${propertyCount}`);

  // 5. Create a rental agreement
  console.log("\nCreating a rental agreement...");
  const rentalAmount = hre.ethers.parseEther("0.5");
  const deposit = hre.ethers.parseEther("1");
  const duration = 7 * 24 * 60 * 60; // 7 days in seconds
  const conditions = "No pets, no smoking, check out by 11am";

  const tx3 = await rentalAgreement.createAgreement(
    user2.address, // tenant
    rentalAmount,
    deposit,
    duration,
    conditions
  );
  await tx3.wait();
  console.log("Rental agreement created successfully!");

  // 6. Get agreement details
  console.log("\nGetting agreement details...");
  const agreement = await rentalAgreement.getAgreement(0);
  console.log(`Tenant: ${agreement.tenant}`);
  console.log(`Landlord: ${agreement.landlord}`);
  console.log(`Rental Amount: ${hre.ethers.formatEther(agreement.rentalAmount)} ETH`);
  console.log(`Deposit: ${hre.ethers.formatEther(agreement.deposit)} ETH`);
  
  // Fix BigInt conversion
  const durationInDays = Number(agreement.duration) / (24 * 60 * 60);
  console.log(`Duration: ${agreement.duration.toString()} seconds (${durationInDays.toFixed(2)} days)`);
  
  console.log(`Conditions: ${agreement.conditions}`);
  console.log(`Status: ${["Pending", "Active", "Terminated"][Number(agreement.status)]}`);

  // 7. Activate the agreement
  console.log("\nActivating the agreement...");
  const tx4 = await rentalAgreement.activateAgreement(0);
  await tx4.wait();
  console.log("Agreement activated!");

  // 8. Check the updated status
  const updatedAgreement = await rentalAgreement.getAgreement(0);
  console.log(`Updated status: ${["Pending", "Active", "Terminated"][Number(updatedAgreement.status)]}`);

  // 9. Update a property listing
  console.log("\nUpdating property listing...");
  const tx5 = await propertyListing.updateProperty(
    0, // property ID
    "Luxury Beachfront Villa with Pool and Hot Tub",
    hre.ethers.parseEther("0.6"), // increased price
    false // mark as unavailable (since it's rented)
  );
  await tx5.wait();
  console.log("Property updated successfully!");

  // 10. Check the updated property
  const updatedProperty = await propertyListing.getProperty(0);
  console.log(`\nUpdated property details:`);
  console.log(`Description: ${updatedProperty.description}`);
  console.log(`Price per day: ${hre.ethers.formatEther(updatedProperty.pricePerDay)} ETH`);
  console.log(`Available: ${updatedProperty.isAvailable}`);

  console.log("\nAll interactions completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 