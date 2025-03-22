const hre = require("hardhat");

async function main() {
  console.log("Starting ServiceMarketplace deployment...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  
  // Deploy Rentocoin
  console.log("\nDeploying Rentocoin...");
  const Rentocoin = await hre.ethers.getContractFactory("Rentocoin");
  const rentocoin = await Rentocoin.deploy(1000000); // 1 million initial supply
  await rentocoin.waitForDeployment();
  const rentocoinAddress = await rentocoin.getAddress();
  console.log(`Rentocoin deployed to: ${rentocoinAddress}`);

  // Deploy ServiceMarketplace
  console.log("\nDeploying ServiceMarketplace...");
  const ServiceMarketplace = await hre.ethers.getContractFactory("ServiceMarketplace");
  const serviceMarketplace = await ServiceMarketplace.deploy(rentocoinAddress);
  await serviceMarketplace.waitForDeployment();
  const serviceMarketplaceAddress = await serviceMarketplace.getAddress();
  console.log(`ServiceMarketplace deployed to: ${serviceMarketplaceAddress}`);

  // Save deployment addresses to a file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      Rentocoin: rentocoinAddress,
      ServiceMarketplace: serviceMarketplaceAddress
    }
  };

  fs.writeFileSync(
    "service-marketplace-deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment information saved to service-marketplace-deployment.json");
  
  console.log("\nServiceMarketplace deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 