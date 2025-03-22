const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting ServiceMarketplace interaction...");

  // Read deployment info
  let deploymentInfo;
  try {
    deploymentInfo = JSON.parse(fs.readFileSync("service-marketplace-deployment.json", "utf8"));
  } catch (error) {
    console.error("Failed to read deployment info. Make sure contracts are deployed first.");
    process.exit(1);
  }

  const network = hre.network.name;
  if (deploymentInfo.network !== network) {
    console.warn(`Warning: Deployment info is for ${deploymentInfo.network}, but current network is ${network}`);
  }

  const rentocoinAddress = deploymentInfo.contracts.Rentocoin;
  const serviceMarketplaceAddress = deploymentInfo.contracts.ServiceMarketplace;

  if (!rentocoinAddress || !serviceMarketplaceAddress) {
    console.error("Rentocoin or ServiceMarketplace addresses not found in deployment info");
    process.exit(1);
  }

  // Get signers
  const [deployer, provider, user] = await hre.ethers.getSigners();
  console.log(`Using account: ${deployer.address}`);

  // Get contract instances
  const rentocoin = await hre.ethers.getContractAt("Rentocoin", rentocoinAddress);
  const serviceMarketplace = await hre.ethers.getContractAt("ServiceMarketplace", serviceMarketplaceAddress);

  // 1. Transfer some Rentocoin to other accounts for testing
  console.log("\n1. Transferring Rentocoin to provider and user...");
  const transferAmount = hre.ethers.parseEther("1000");
  
  const tx1 = await rentocoin.transfer(provider.address, transferAmount);
  await tx1.wait();
  console.log(`Transferred ${hre.ethers.formatEther(transferAmount)} RENT to provider: ${provider.address}`);
  
  const tx2 = await rentocoin.transfer(user.address, transferAmount);
  await tx2.wait();
  console.log(`Transferred ${hre.ethers.formatEther(transferAmount)} RENT to user: ${user.address}`);

  // 2. Add a service
  console.log("\n2. Adding a new service...");
  const serviceName = "Home Cleaning";
  const servicePrice = hre.ethers.parseEther("0.1");
  
  const tx3 = await serviceMarketplace.connect(provider).addService(serviceName, servicePrice);
  await tx3.wait();
  console.log(`Service "${serviceName}" added with price ${hre.ethers.formatEther(servicePrice)} ETH`);

  // 3. Get service details
  console.log("\n3. Service details:");
  const serviceId = 0;
  const service = await serviceMarketplace.services(serviceId);
  console.log(`- ID: ${service.id}`);
  console.log(`- Name: ${service.name}`);
  console.log(`- Provider: ${service.provider}`);
  console.log(`- Price: ${hre.ethers.formatEther(service.price)} ETH`);
  console.log(`- Active: ${service.active}`);

  // 4. Book a service with ETH
  console.log("\n4. Booking service with ETH...");
  const tx4 = await serviceMarketplace.connect(user).bookService(serviceId, false, { value: servicePrice });
  await tx4.wait();
  const bookingIdEth = 0;
  console.log(`Service booked with ETH, booking ID: ${bookingIdEth}`);

  // 5. Complete the ETH booking
  console.log("\n5. Completing ETH booking...");
  const tx5 = await serviceMarketplace.connect(provider).completeBooking(bookingIdEth);
  await tx5.wait();
  console.log(`Booking ${bookingIdEth} completed`);

  // 6. Approve and book a service with Rentocoin
  console.log("\n6. Booking service with Rentocoin...");
  const tx6 = await rentocoin.connect(user).approve(serviceMarketplaceAddress, servicePrice);
  await tx6.wait();
  console.log(`Approved ServiceMarketplace to spend ${hre.ethers.formatEther(servicePrice)} RENT`);
  
  const tx7 = await serviceMarketplace.connect(user).bookService(serviceId, true);
  await tx7.wait();
  const bookingIdRent = 1;
  console.log(`Service booked with Rentocoin, booking ID: ${bookingIdRent}`);

  // 7. Complete the Rentocoin booking
  console.log("\n7. Completing Rentocoin booking...");
  const tx8 = await serviceMarketplace.connect(provider).completeBooking(bookingIdRent);
  await tx8.wait();
  console.log(`Booking ${bookingIdRent} completed`);

  // 8. View final booking details
  console.log("\n8. Final booking details:");
  
  const bookingEth = await serviceMarketplace.bookings(bookingIdEth);
  console.log(`\nETH Booking (ID: ${bookingEth.id}):`);
  console.log(`- User: ${bookingEth.user}`);
  console.log(`- Service ID: ${bookingEth.serviceId}`);
  console.log(`- Amount: ${hre.ethers.formatEther(bookingEth.amountPaid)} ETH`);
  console.log(`- Paid with Rentocoin: ${bookingEth.paidWithRentocoin}`);
  console.log(`- Completed: ${bookingEth.completed}`);
  
  const bookingRent = await serviceMarketplace.bookings(bookingIdRent);
  console.log(`\nRentocoin Booking (ID: ${bookingRent.id}):`);
  console.log(`- User: ${bookingRent.user}`);
  console.log(`- Service ID: ${bookingRent.serviceId}`);
  console.log(`- Amount: ${hre.ethers.formatEther(bookingRent.amountPaid)} RENT`);
  console.log(`- Paid with Rentocoin: ${bookingRent.paidWithRentocoin}`);
  console.log(`- Completed: ${bookingRent.completed}`);

  console.log("\nServiceMarketplace interaction completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 