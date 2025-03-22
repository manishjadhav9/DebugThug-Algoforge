# Tor-Rent: Redefining Rentals with Blockchain

## Abstract
Tor-Rent is a decentralized rental application that leverages blockchain technology to provide a secure, transparent, and efficient rental experience. By integrating React (frontend), Node.js (backend), MongoDB (database), and Web3 (blockchain), along with Metamask for authentication and Polygon Ethereum for payments, Tor-Rent addresses common challenges in the rental industry, such as fraud, delayed payments, and disputes.

---

## Problem Statement
The rental industry is plagued by issues like rental fraud, delayed payments, lack of item-specific rental systems, and frequent disputes between tenants and landlords. Traditional rental agreements are susceptible to forgery, challenging to enforce, and often lack transparency, leading to inefficiencies and mistrust among parties. Additionally, current rental platforms are primarily focused on apartment rentals, neglecting a broader market of various items available for rent, such as vehicles, gadgets, and furniture.

---

## Solution
Tor-Rent introduces a blockchain-based rental agreement system that ensures secure, tamper-proof, and automated contracts. By leveraging smart contracts, the system offers:

- **Transparent Agreements**: Immutable and verifiable agreements stored on blockchain ledgers.
- **Automated Payments and Deposits**: Automatic rent payments and deposit refunds via smart contracts.
- **Decentralized Dispute Resolution**: Efficient arbitration through community governance or assigned mediators.
- **Identity Verification and Trust**: Enhanced security via decentralized identity systems.
- **Smart Contract Enforcement**: Automated compliance enforcement with pre-defined rules.

---

## Key Features
- **Seamless Property Listings**
- **User Dashboard**
- **Trustless Security**
- **Modern & Responsive UI**
- **AI Chatbot (Gemini)**
- **Services Marketplace (Plumber, Electrician, etc.)**
- **Properties Map View**
- **Property Comparison Tool**
- **Issue Reporting System**
- **Community Discussion Forum (Anonymous)**
- **Tenant-Landlord Chat (Non-Anonymous)**
- **Gamified Loyalty System (Rentocoin, Badges)**
- **Multi-Item Rental Support:** Enhanced system to support rentals beyond apartments, such as cars, equipment, and other rentable items, with tailored booking processes.
- **Dual Login System:** Landlord and Tenant roles with distinct functionalities, ensuring a seamless and personalized user experience.
- **Secure Data Management:** Data stored in MongoDB for general information and SQLite for gamification features.

---

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, SQLite (Gamification), MongoDB (General Data Storage)
- **Blockchain:** Solidity, Hardhat, Ethers.js, Polygon
- **Web3 Integration:** Metamask
- **File Storage:** Decentralized storage systems (Future enhancement)

---

## Smart Contracts
1. **RentalAgreement.sol** - Rental agreements handling.
2. **PaymentProcessor.sol** - Rent and deposit processing.
3. **DisputeResolution.sol** - Conflict resolution.
4. **IdentityVerification.sol** - Identity management.
5. **PropertyListing.sol** - Property listing management.
6. **Enforcement.sol** - Contract enforcement.

---

## Routes
### Authentication
- `POST /api/auth/login` - Login with Metamask.
- `POST /api/auth/logout` - Logout user.

### Property Management
- `POST /api/properties` - Add a property.
- `GET /api/properties` - Retrieve all properties.
- `GET /api/properties/:id` - Retrieve specific property details.
- `PUT /api/properties/:id` - Update property details.
- `DELETE /api/properties/:id` - Delete a property.
- `POST /api/properties/compare` - Compare multiple properties.
- `GET /api/properties/available` - View all available properties.
- `GET /api/properties/map-view` - View properties on map.

### Rental Management
- `POST /api/rental/book` - Book a property.
- `POST /api/rental/terminate` - Terminate rental agreement.
- `POST /api/rental/report-issue` - Report an issue.

### Payment & Rewards
- `POST /api/payment/pay` - Pay rent via Metamask.
- `POST /api/payment/redeem-rentocoin` - Redeem Rentocoin.
- `GET /api/payment/transactions` - View payment transactions.

### Community & Chat
- `POST /api/community/post` - Create a forum post (Anonymous).
- `GET /api/community/posts` - Retrieve forum posts.
- `POST /api/chat/send` - Send a message (Non-Anonymous).

### AI Interaction
- `POST /api/chatbot` - Interact with AI chatbot.

---

## Database Schema
### SQLite (Gamification System)
```sql
-- Users Table
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    wallet_address TEXT,
    score INTEGER DEFAULT 0
);

-- Badges Table
CREATE TABLE Badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
);

-- UserBadges Table
CREATE TABLE UserBadges (
    user_id INTEGER,
    badge_id INTEGER,
    earned_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(badge_id) REFERENCES Badges(id)
);

-- Rentocoin Transactions Table
CREATE TABLE RentocoinTransactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount INTEGER,
    type TEXT, -- 'earn' or 'spend'
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id)
);
```

---

## Impact
- **Trust and Transparency:** Immutable transactions and agreements via blockchain.
- **Data Security:** Decentralized storage systems.
- **Cost-Effective Transactions:** Reduced fees with Polygon.
- **Enhanced User Experience:** Modern UI and intuitive interactions.

---

## Future Enhancements
- Improve AR Property Tours.
- Enhance AI chatbot capabilities.
- Expand Services Marketplace.
- Improve Rental Agreement Download System.


Smart Contracts List
RentalAgreement.sol

Handles creation, modification, and termination of rental agreements.

Stores essential rental terms, such as rental amount, deposit, duration, and conditions.

Facilitates agreement between Landlords and Tenants with automated enforcement of terms.

PaymentProcessor.sol

Manages rent payments and deposits.

Ensures automated transfer of funds between Tenant and Landlord upon successful transaction.

Handles refund of deposits based on predefined conditions.

DisputeResolution.sol

Provides decentralized mechanisms for dispute resolution.

Allows community voting or assigned mediators to resolve conflicts.

Escrow system for holding disputed funds until resolution.

IdentityVerification.sol

Verifies user identities via wallet signatures or third-party integrations.

Associates verified identities with rental agreements to prevent fraud.

PropertyListing.sol

Allows Landlords to create, update, and delete property listings.

Stores property details such as description, availability, pricing, etc.

Supports multi-item rental listings (apartments, vehicles, gadgets, etc.).

Enforcement.sol

Enforces contract terms like rental duration, payments, and conditions.

Automatically penalizes parties for breaches in agreement.

Supports blacklist functionality for fraudulent users.

Gamification.sol

Manages Rentocoin, Badges, and XP rewards.

Issues rewards based on user activities like timely payments, providing good service, etc.

Allows redemption of Rentocoin for benefits or services.

