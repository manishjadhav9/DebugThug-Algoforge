// Script to fund a specific wallet and check balance
const { ethers } = require('ethers');

// Default values
const PROVIDER_URL = 'http://127.0.0.1:8545';
const TARGET_ADDRESS = '0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85';
const DEFAULT_FUNDING_AMOUNT = '1.0'; // in ETH
const DEFAULT_GAS_LIMIT = 21000;

// Hardhat default account (Account #0)
const FAUCET_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

async function fundSpecificWallet() {
  try {
    // Setup provider and signer
    console.log(`Connecting to provider at ${PROVIDER_URL}...`);
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
    const faucetWallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);

    // Get command line arguments or use defaults
    const targetAddress = process.argv[2] || TARGET_ADDRESS;
    const amount = process.argv[3] || DEFAULT_FUNDING_AMOUNT;

    // Get initial balance
    const initialBalance = await provider.getBalance(targetAddress);
    console.log(`Initial balance: ${ethers.utils.formatEther(initialBalance)} ETH`);

    // Check faucet balance
    const faucetBalance = await provider.getBalance(faucetWallet.address);
    console.log(`Faucet balance: ${ethers.utils.formatEther(faucetBalance)} ETH`);

    if (faucetBalance.lt(ethers.utils.parseEther(amount))) {
      console.error('Error: Faucet has insufficient funds');
      process.exit(1);
    }

    console.log(`Funding wallet ${targetAddress} with ${amount} ETH...`);

    // Send transaction
    const tx = await faucetWallet.sendTransaction({
      to: targetAddress,
      value: ethers.utils.parseEther(amount),
      gasLimit: DEFAULT_GAS_LIMIT,
    });

    console.log(`Transaction sent: ${tx.hash}`);
    console.log('Waiting for confirmation...');

    // Wait for confirmation
    const receipt = await tx.wait();
    
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Successfully funded wallet with ${amount} ETH`);
    
    // Get updated target wallet balance
    const updatedBalance = await provider.getBalance(targetAddress);
    console.log(`Updated wallet balance: ${ethers.utils.formatEther(updatedBalance)} ETH`);
    
    // Calculate and show the difference
    const balanceDiff = updatedBalance.sub(initialBalance);
    console.log(`Balance increased by: ${ethers.utils.formatEther(balanceDiff)} ETH`);

  } catch (error) {
    console.error('Error funding wallet:', error.message);
    process.exit(1);
  }
}

// Run the function
fundSpecificWallet(); 