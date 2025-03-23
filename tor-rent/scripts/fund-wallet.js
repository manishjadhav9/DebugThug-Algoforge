// Simple script to fund a wallet with ETH from a Hardhat account
const { ethers } = require('ethers');

// Default values
const PROVIDER_URL = 'http://127.0.0.1:8545';
const DEFAULT_FUNDING_AMOUNT = '1.0'; // in ETH
const DEFAULT_GAS_LIMIT = 21000;

// Hardhat default account (Account #0)
const FAUCET_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

async function fundWallet() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    const targetAddress = args[0];
    const amount = args[1] || DEFAULT_FUNDING_AMOUNT;

    if (!targetAddress) {
      console.error('Error: Target wallet address is required');
      console.log('Usage: node fund-wallet.js <wallet-address> [amount-in-eth]');
      console.log('Example: node fund-wallet.js 0x123... 2.0');
      process.exit(1);
    }

    // Setup provider and signer
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
    const faucetWallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);

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
    
    // Get target wallet balance
    const targetBalance = await provider.getBalance(targetAddress);
    console.log(`Target wallet balance: ${ethers.utils.formatEther(targetBalance)} ETH`);

  } catch (error) {
    console.error('Error funding wallet:', error.message);
    process.exit(1);
  }
}

// Run the function
fundWallet(); 