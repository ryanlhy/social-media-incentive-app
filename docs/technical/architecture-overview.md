# Payment System Architecture Overview - MVP

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Component Diagram](#component-diagram)
- [Key Components](#key-components)
- [Data Flow](#data-flow)
- [Security Model](#security-model)
- [Technology Stack](#technology-stack)

## Overview

The EngageReward payment system is built on a **simple credit-based architecture** for the MVP. **Community leaders** deposit USDC directly to the platform wallet and receive platform credits for campaign funding. The system supports both USDC and token airdrops for community engagement rewards.

### Core Principles
- **Simplicity**: Easy-to-understand credit system
- **Security**: Basic security with platform wallet
- **User Experience**: Intuitive interface with basic error handling

## System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "User Layer"
        CA[Community Leader App<br/>- Campaign Management<br/>- Credit Dashboard<br/>- Raid Campaign Creation]
        PA[Community Member App<br/>- Reward Claims<br/>- Transaction History<br/>- Raid Participation]
    end
    
    subgraph "Platform Services"
        API[Payment API<br/>- Credit Management<br/>- Transaction Processing<br/>- Basic Verification]
        AUTH[Supabase Auth<br/>- User Registration<br/>- Authentication<br/>- Account Management<br/>- Row Level Security]
        DB[(Database<br/>- User Accounts<br/>- Credit Balances<br/>- Transaction Logs)]
        MONITOR[Transaction Monitor<br/>- Wallet Monitoring<br/>- Basic Auto-Verification]
    end
    
    subgraph "Blockchain Layer"
        SOL[Solana Network<br/>- USDC Transfers<br/>- Transaction Confirmation]
        WALLET[Platform Wallet<br/>- USDC Storage<br/>- Basic Security]
    end
    
    subgraph "External Services"
        TWITTER[Twitter API<br/>- Engagement Verification<br/>- Account Connection]
        NOTIFY[Notification Service<br/>- Email Alerts]
    end
    
    CA <--> API
    PA <--> API
    API <--> AUTH
    API <--> DB
    API <--> MONITOR
    MONITOR <--> SOL
    MONITOR <--> WALLET
    API <--> TWITTER
    API <--> NOTIFY
    
    style CA fill:#2196f3,stroke:#1976d2,color:#ffffff
    style PA fill:#2196f3,stroke:#1976d2,color:#ffffff
    style API fill:#9c27b0,stroke:#7b1fa2,color:#ffffff
    style AUTH fill:#ff5722,stroke:#d84315,color:#ffffff
    style DB fill:#4caf50,stroke:#388e3c,color:#ffffff
    style MONITOR fill:#ff9800,stroke:#f57c00,color:#ffffff
    style SOL fill:#e91e63,stroke:#c2185b,color:#ffffff
    style WALLET fill:#e91e63,stroke:#c2185b,color:#ffffff
    style TWITTER fill:#00bcd4,stroke:#0097a7,color:#ffffff
    style NOTIFY fill:#795548,stroke:#5d4037,color:#ffffff
```

## Key Components

### 1. User Layer
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **Community Leader App** | Community leader interface for campaign management | Credit dashboard, raid campaign creation, basic engagement tracking |
| **Community Member App** | Community member interface for rewards | Reward claims, transaction history, raid participation |

### 2. Platform Services
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **Payment API** | Core payment processing logic | Credit management, transaction processing, basic verification |
| **Database** | Data persistence and management | User accounts, credit balances, transaction logs |
| **Transaction Monitor** | Basic transaction tracking | Wallet monitoring, auto-verification |

### 3. Blockchain Layer
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **Solana Network** | Blockchain infrastructure | USDC transfers, transaction confirmation |
| **Platform Wallet** | Secure fund storage | USDC storage, basic security |

### 4. External Services
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **Twitter API** | Social media integration | Engagement verification, account connection |
| **Notification Service** | User communication | Email alerts |

## Data Flow

### Primary Payment Flow

```mermaid
sequenceDiagram
    participant CommunityLeader
    participant Platform
    participant Solana
    participant Monitor
    participant Database
    
    CommunityLeader->>Platform: Request Credit Purchase
    Platform->>CommunityLeader: Provide Platform Wallet Address
    CommunityLeader->>Solana: Transfer USDC to Platform Wallet
    Solana->>Monitor: Transaction Confirmation
    Monitor->>Database: Verify Community Leader Address
    Monitor->>Database: Add Credits to Community Leader Account
    Monitor->>Platform: Credit Purchase Complete
    Platform->>CommunityLeader: Send Confirmation & Updated Balance
```

### Raid Campaign Flow

```mermaid
sequenceDiagram
    participant CommunityLeader
    participant Platform
    participant Database
    participant Twitter
    participant CommunityMembers
    
    CommunityLeader->>Platform: Create 24-Hour Raid Campaign (with tweet URL)
    Platform->>Database: Get Community Leader's Twitter Handle
    Platform->>Twitter: Verify Tweet Ownership
    Twitter->>Platform: Confirm Tweet Author
    alt Tweet Owned by Community Leader
        Platform->>Database: Check Credit Balance
        Database->>Platform: Sufficient Credits Available
        Platform->>Database: Reserve Credits for Campaign
        Platform->>Database: Create Campaign with Verified Tweet
        Platform->>CommunityLeader: Raid Campaign Created Successfully
        
        CommunityMembers->>Platform: Submit X Post Engagement
        Platform->>Twitter: Verify Engagement on Specific Post
        Twitter->>Platform: Engagement Confirmed
        Platform->>Database: Update Community Member Status
        Platform->>Database: Calculate Rewards
        Platform->>CommunityMembers: Distribute USDC & Token Rewards
    else Tweet Not Owned
        Platform->>CommunityLeader: Error: You can only create campaigns for your own posts
    end
```

## Security Model

### Basic Security Architecture

```mermaid
graph TB
    subgraph "Platform Wallet Security"
        WALLET[Platform Wallet<br/>- USDC Storage<br/>- Basic Security<br/>- Transaction Limits]
    end
    
    subgraph "Security Controls"
        LIMITS[Transaction Limits<br/>- Daily Limits<br/>- Per-User Limits]
        MONITOR[Basic Monitoring<br/>- Transaction Alerts<br/>- Manual Review]
    end
    
    WALLET --> LIMITS
    WALLET --> MONITOR
```

### Security Layers

| Layer | Purpose | Implementation |
|-------|---------|----------------|
| **Application Security** | API protection and user authentication | Supabase Auth, basic rate limiting |
| **Campaign Security** | Creator-only campaign validation | Tweet ownership verification, social account linking |
| **Transaction Security** | Secure payment processing | Transaction limits, basic monitoring |
| **Infrastructure Security** | System and network protection | Basic firewalls, secure hosting |

### Creator-Only Campaign Security

The platform enforces a strict **creator-only model** where users can only create campaigns for their own Twitter posts. This security model prevents unauthorized promotion and maintains authenticity.

#### Tweet Ownership Verification Flow

```mermaid
sequenceDiagram
    participant Creator
    participant Platform
    participant TwitterAPI
    participant Database
    
    Creator->>Platform: Submit campaign with tweet URL
    Platform->>Database: Get creator's verified Twitter handle
    Database->>Platform: Return @creator_handle
    Platform->>TwitterAPI: Get tweet author for tweet ID
    TwitterAPI->>Platform: Return @tweet_author
    
    alt Tweet owned by creator
        Platform->>Database: Create campaign (approved)
        Platform->>Creator: Campaign created successfully
    else Tweet not owned by creator
        Platform->>Creator: Error: "You can only create campaigns for your own posts"
    end
```

#### Security Validation Steps

1. **Twitter Account Connection**: Creator must have verified Twitter account linked
2. **URL Validation**: Tweet URL must be valid and accessible
3. **Ownership Verification**: Tweet author must match creator's verified handle
4. **Access Control**: Only authenticated creators can create campaigns
5. **Audit Trail**: All verification attempts are logged

#### Security Benefits

- **Prevents Spam**: Users cannot promote others' content without permission
- **Maintains Authenticity**: Only genuine creators can incentivize their content
- **Legal Protection**: Avoids copyright and consent issues
- **Quality Control**: Ensures creators have genuine investment in their content
- **Trust Building**: Community knows they're supporting actual content creators

## Technology Stack

### Backend Technologies
- **API Framework**: Node.js with Express.js
- **Database**: PostgreSQL (Supabase)
- **Blockchain Integration**: Solana Web3.js
- **Authentication**: Supabase Auth
- **Social Media**: OAuth2 with platform-specific APIs

### Frontend Technologies
- **Web Application**: React.js
- **State Management**: Basic state management
- **UI Framework**: Material-UI
- **Authentication**: Supabase Auth SDK

### Infrastructure
- **Cloud Platform**: Supabase (PostgreSQL + Auth)
- **Database Service**: Supabase PostgreSQL
- **Authentication Service**: Supabase Auth
- **Basic Monitoring**: Simple logging and monitoring

### External Integrations
- **Blockchain**: Solana Network (via Helius RPC)
- **Social Media**: Twitter API, YouTube API (future)
- **Notifications**: Email service
- **User Management**: Supabase Auth

## Scalability Considerations

### Current Capacity
- **Daily Transactions**: Up to 50 credit purchases
- **Concurrent Users**: Up to 25 simultaneous users
- **Campaign Processing**: Up to 10 active campaigns
- **Reward Distribution**: Up to 50 rewards per hour

### Basic Scaling Strategy
- **Simple Load Balancing**: Basic load balancing across servers
- **Database Optimization**: Basic connection pooling
- **Batch Processing**: Simple batch processing for rewards

## Implementation Phases

### Phase 1: MVP (2-3 weeks)
- Basic credit system implementation
- Manual transaction verification
- Essential security measures
- Basic address validation
- Token airdrop support
- Simple campaign management

### Phase 2: Basic Enhancements (2-3 weeks)
- Automated transaction monitoring
- Basic address learning system
- Improved error handling
- Enhanced user interface

## Detailed Technical Specifications

For detailed implementation specifications including:
- **Database Schema**: Complete table definitions and relationships
- **API Specifications**: RESTful endpoints and data formats
- **External Integrations**: Twitter API, Solana RPC (Helius), Email service setup
- **Module Breakdown**: Detailed component architecture and functions
- **Security Implementation**: Specific security measures and configurations

See: **[Technical Implementation Guide](technical-implementation-guide.md)**

---

*This architecture overview provides a high-level understanding of the MVP payment system design. For detailed implementation specifications, refer to the Technical Implementation Guide.*
