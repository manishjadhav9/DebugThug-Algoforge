// Simple script to check wallet balance
const { ethers } = require('ethers');

// Default values
const PROVIDER_URL = 'http://127.0.0.1:8545';
const TARGET_ADDRESS = '0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85';

async function checkWalletBalance() {
  try {
    // Setup provider
    console.log(`Connecting to provider at ${PROVIDER_URL}...`);
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
    
    // Get target address from command line or use default
    const targetAddress = process.argv[2] || TARGET_ADDRESS;
    
    console.log(`Checking balance for wallet: ${targetAddress}`);

    // Check balance
    const balance = await provider.getBalance(targetAddress);
    const formattedBalance = ethers.utils.formatEther(balance);
    
    console.log(`----------------------`);
    console.log(`Wallet Address: ${targetAddress}`);
    console.log(`Current Balance: ${formattedBalance} ETH`);
    console.log(`----------------------`);

    return formattedBalance;
  } catch (error) {
    console.error('Error checking wallet balance:', error.message);
    process.exit(1);
  }
}

// Run the function
checkWalletBalance(); 