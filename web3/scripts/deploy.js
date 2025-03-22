const hre = require("hardhat");

async function main() {
  console.log("Starting deployment process...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Deploy Identity Verification
  const IdentityVerification = await hre.ethers.getContractFactory("IdentityVerification");
  const identityVerification = await IdentityVerification.deploy();
  await identityVerification.waitForDeployment();
  const identityVerificationAddress = await identityVerification.getAddress();
  console.log(`IdentityVerification deployed to: ${identityVerificationAddress}`);

  // Deploy PropertyListing
  const PropertyListing = await hre.ethers.getContractFactory("PropertyListing");
  const propertyListing = await PropertyListing.deploy();
  await propertyListing.waitForDeployment();
  const propertyListingAddress = await propertyListing.getAddress();
  console.log(`PropertyListing deployed to: ${propertyListingAddress}`);

  // Deploy RentalAgreement
  const RentalAgreement = await hre.ethers.getContractFactory("RentalAgreement");
  const rentalAgreement = await RentalAgreement.deploy();
  await rentalAgreement.waitForDeployment();
  const rentalAgreementAddress = await rentalAgreement.getAddress();
  console.log(`RentalAgreement deployed to: ${rentalAgreementAddress}`);

  // Deploy PaymentProcessor
  const PaymentProcessor = await hre.ethers.getContractFactory("PaymentProcessor");
  const paymentProcessor = await PaymentProcessor.deploy();
  await paymentProcessor.waitForDeployment();
  const paymentProcessorAddress = await paymentProcessor.getAddress();
  console.log(`PaymentProcessor deployed to: ${paymentProcessorAddress}`);

  // Deploy Gamification
  const Gamification = await hre.ethers.getContractFactory("Gamification");
  const gamification = await Gamification.deploy();
  await gamification.waitForDeployment();
  const gamificationAddress = await gamification.getAddress();
  console.log(`Gamification deployed to: ${gamificationAddress}`);

  // Deploy DisputeResolution
  const DisputeResolution = await hre.ethers.getContractFactory("DisputeResolution");
  const disputeResolution = await DisputeResolution.deploy();
  await disputeResolution.waitForDeployment();
  const disputeResolutionAddress = await disputeResolution.getAddress();
  console.log(`DisputeResolution deployed to: ${disputeResolutionAddress}`);

  // Deploy Enforcement
  const Enforcement = await hre.ethers.getContractFactory("Enforcement");
  const enforcement = await Enforcement.deploy();
  await enforcement.waitForDeployment();
  const enforcementAddress = await enforcement.getAddress();
  console.log(`Enforcement deployed to: ${enforcementAddress}`);

  // Save deployment addresses to a file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      IdentityVerification: identityVerificationAddress,
      PropertyListing: propertyListingAddress,
      RentalAgreement: rentalAgreementAddress,
      PaymentProcessor: paymentProcessorAddress,
      Gamification: gamificationAddress,
      DisputeResolution: disputeResolutionAddress,
      Enforcement: enforcementAddress
    }
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment information saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 