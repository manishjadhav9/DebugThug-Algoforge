const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Generating ABI files for ServiceMarketplace and Rentocoin...");

  // Create abi directory if it doesn't exist
  const abiDir = path.join(__dirname, "..", "abi");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
  }

  // ServiceMarketplace ABI
  const serviceMarketplacePath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "ServiceMarketplace.sol",
    "ServiceMarketplace.json"
  );

  // Rentocoin ABI
  const rentocoinPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "Rentocoin.sol",
    "Rentocoin.json"
  );

  try {
    // Extract and save ServiceMarketplace ABI
    const serviceMarketplaceData = JSON.parse(fs.readFileSync(serviceMarketplacePath, "utf8"));
    fs.writeFileSync(
      path.join(abiDir, "ServiceMarketplace.json"),
      JSON.stringify(serviceMarketplaceData.abi, null, 2)
    );
    console.log("ServiceMarketplace ABI saved to abi/ServiceMarketplace.json");

    // Extract and save Rentocoin ABI
    const rentocoinData = JSON.parse(fs.readFileSync(rentocoinPath, "utf8"));
    fs.writeFileSync(
      path.join(abiDir, "Rentocoin.json"),
      JSON.stringify(rentocoinData.abi, null, 2)
    );
    console.log("Rentocoin ABI saved to abi/Rentocoin.json");

    console.log("ABI generation completed successfully!");
  } catch (error) {
    console.error("Error generating ABI files:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 