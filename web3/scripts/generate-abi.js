const fs = require('fs');
const path = require('path');
const hre = require('hardhat');

async function main() {
  console.log('Compiling contracts...');
  await hre.run('compile');

  const contractNames = [
    'PropertyListing',
    'RentalAgreement',
    'PaymentProcessor',
    'IdentityVerification',
    'Gamification',
    'Enforcement',
    'DisputeResolution'
  ];

  // Create abi directory if it doesn't exist
  const abiDir = path.join(__dirname, '../abi');
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
  }

  for (const contractName of contractNames) {
    try {
      // Get contract artifact
      const artifact = require(`../artifacts/contracts/${contractName}.sol/${contractName}.json`);
      
      // Extract ABI
      const abi = JSON.stringify(artifact.abi, null, 2);
      
      // Write ABI to file
      fs.writeFileSync(
        path.join(abiDir, `${contractName}.json`),
        abi
      );
      
      console.log(`ABI for ${contractName} generated successfully.`);
    } catch (error) {
      console.error(`Error generating ABI for ${contractName}:`, error.message);
    }
  }

  console.log('All ABIs generated successfully.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 