# ServiceMarketplace Contract

ServiceMarketplace is a decentralized marketplace for service providers to list their services and users to book and pay for them using either Ether or Rentocoin (ERC20 token).

## Features

- Service providers can list, update, or deactivate their services
- Users can book services using either ETH or Rentocoin
- Service providers can mark bookings as completed
- Supports both cryptocurrency payment options

## Contract Structure

- `Service`: Represents a service with ID, name, provider address, price, and active status
- `Booking`: Represents a booking with ID, user address, service ID, amount paid, payment type, and completion status

## Smart Contracts

1. **ServiceMarketplace.sol**: The main marketplace contract with service listing and booking functionality
2. **Rentocoin.sol**: An ERC20 token used as an alternative payment method

## Testing and Deployment

### Prerequisites

- Node.js and npm installed
- Hardhat development environment set up

### Setup

1. Clone the repository
2. Navigate to the web3 directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your `.env` file with your private key and RPC URLs:
   ```
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
   PRIVATE_KEY=your-private-key-here
   ```

### Testing

Run the ServiceMarketplace tests:

```bash
npm run test:service
```

### Local Deployment

1. Start a local Hardhat node:
   ```bash
   npm run node
   ```

2. In a separate terminal, deploy contracts to localhost:
   ```bash
   npm run deploy:localhost
   ```

3. Interact with deployed contracts:
   ```bash
   npm run interact-service:localhost
   ```

### Testnet Deployment (Sepolia)

Deploy to Sepolia testnet:

```bash
npm run deploy:sepolia
```

## Contract Usage

### For Service Providers

1. `addService(string name, uint256 price)`: List a new service
2. `updateService(uint256 serviceId, string name, uint256 price)`: Update service details
3. `deactivateService(uint256 serviceId)`: Deactivate a service
4. `completeBooking(uint256 bookingId)`: Mark a booking as completed

### For Users

1. `bookService(uint256 serviceId, bool payWithRentocoin)`: Book a service with ETH or Rentocoin
   - If using ETH, include the service price as msg.value
   - If using Rentocoin, first approve the ServiceMarketplace contract to spend your tokens

### View Functions

1. `getService(uint256 serviceId)`: Get service details
2. `getBooking(uint256 bookingId)`: Get booking details

## Events

- `ServiceAdded`: Emitted when a new service is added
- `ServiceUpdated`: Emitted when a service is updated
- `ServiceDeactivated`: Emitted when a service is deactivated
- `BookingMade`: Emitted when a service is booked
- `BookingCompleted`: Emitted when a booking is completed 