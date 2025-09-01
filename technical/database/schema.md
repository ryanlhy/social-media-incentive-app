# Database Schema - EngageReward MVP

## Overview

This document defines the complete database schema for the EngageReward MVP platform. The schema is designed for PostgreSQL and includes all necessary tables, relationships, and indexes for the core functionality.

## Core Tables

### 1. **users**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    user_type ENUM('community_leader', 'community_member') NOT NULL,
    solana_wallet_address VARCHAR(44) UNIQUE,
    twitter_handle VARCHAR(15) UNIQUE,
    twitter_user_id VARCHAR(50),
    twitter_access_token TEXT,
    twitter_refresh_token TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store user account information and authentication details.

**Key Fields**:
- `user_type`: Distinguishes between community leaders and members
- `solana_wallet_address`: For USDC transactions
- `twitter_handle`: For social media verification
- `twitter_access_token`: OAuth token for Twitter API access

### 2. **credit_balances**
```sql
CREATE TABLE credit_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    balance DECIMAL(20,6) DEFAULT 0,
    total_earned DECIMAL(20,6) DEFAULT 0,
    total_spent DECIMAL(20,6) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Track user credit balances and transaction history.

**Key Fields**:
- `balance`: Current available credits
- `total_earned`: Lifetime credits earned
- `total_spent`: Lifetime credits spent

### 3. **credit_transactions**
```sql
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    transaction_type ENUM('purchase', 'spend', 'refund', 'bonus') NOT NULL,
    amount DECIMAL(20,6) NOT NULL,
    solana_transaction_hash VARCHAR(88),
    solana_sender_address VARCHAR(44),
    status ENUM('pending', 'confirmed', 'failed', 'cancelled') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Log all credit-related transactions for audit and tracking.

**Key Fields**:
- `transaction_type`: Type of transaction (purchase, spend, etc.)
- `solana_transaction_hash`: Blockchain transaction reference
- `status`: Current transaction status

### 4. **raid_campaigns**
```sql
CREATE TABLE raid_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_leader_id UUID REFERENCES users(id),
    campaign_name VARCHAR(255) NOT NULL,
    x_post_url VARCHAR(500) NOT NULL,
    x_post_id VARCHAR(50),
    campaign_duration_hours INTEGER DEFAULT 24,
    total_budget DECIMAL(20,6) NOT NULL,
    reward_per_like DECIMAL(20,6) DEFAULT 0,
    reward_per_comment DECIMAL(20,6) DEFAULT 0,
    reward_per_retweet DECIMAL(20,6) DEFAULT 0,
    token_airdrop_amount DECIMAL(20,6) DEFAULT 0,
    token_contract_address VARCHAR(44),
    status ENUM('draft', 'active', 'paused', 'completed', 'cancelled') DEFAULT 'draft',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store raid campaign configurations and settings.

**Key Fields**:
- `x_post_url`: Target X post for engagement
- `reward_per_like/comment/retweet`: Reward amounts for each action type
- `token_airdrop_amount`: Amount of project tokens to distribute
- `token_contract_address`: Solana token contract address

### 5. **campaign_participants**
```sql
CREATE TABLE campaign_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES raid_campaigns(id),
    community_member_id UUID REFERENCES users(id),
    status ENUM('invited', 'registered', 'verified', 'participated', 'rewarded') DEFAULT 'invited',
    twitter_connected BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    retweets_count INTEGER DEFAULT 0,
    total_earned DECIMAL(20,6) DEFAULT 0,
    tokens_earned DECIMAL(20,6) DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    participated_at TIMESTAMP,
    rewarded_at TIMESTAMP
);
```

**Purpose**: Track participant engagement and rewards for each campaign.

**Key Fields**:
- `status`: Participant's current status in the campaign
- `likes_count/comments_count/retweets_count`: Engagement metrics
- `total_earned/tokens_earned`: Rewards earned

### 6. **engagement_verifications**
```sql
CREATE TABLE engagement_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES campaign_participants(id),
    engagement_type ENUM('like', 'comment', 'retweet') NOT NULL,
    x_engagement_id VARCHAR(50),
    verification_status ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
    reward_amount DECIMAL(20,6) DEFAULT 0,
    token_amount DECIMAL(20,6) DEFAULT 0,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Track individual engagement verifications and rewards.

**Key Fields**:
- `engagement_type`: Type of social media engagement
- `x_engagement_id`: Twitter engagement ID for verification
- `verification_status`: Current verification status

### 7. **reward_distributions**
```sql
CREATE TABLE reward_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES campaign_participants(id),
    usdc_amount DECIMAL(20,6) NOT NULL,
    token_amount DECIMAL(20,6) DEFAULT 0,
    solana_transaction_hash VARCHAR(88),
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Track reward distributions to participants.

**Key Fields**:
- `usdc_amount`: USDC amount distributed
- `token_amount`: Project token amount distributed
- `solana_transaction_hash`: Blockchain transaction reference

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_twitter_handle ON users(twitter_handle);
CREATE INDEX idx_users_solana_address ON users(solana_wallet_address);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_hash ON credit_transactions(solana_transaction_hash);
CREATE INDEX idx_raid_campaigns_leader ON raid_campaigns(community_leader_id);
CREATE INDEX idx_raid_campaigns_status ON raid_campaigns(status);
CREATE INDEX idx_campaign_participants_campaign ON campaign_participants(campaign_id);
CREATE INDEX idx_campaign_participants_member ON campaign_participants(community_member_id);
CREATE INDEX idx_engagement_verifications_participant ON engagement_verifications(participant_id);
```

## Relationships

### Primary Relationships
1. **users** → **credit_balances** (1:1)
2. **users** → **credit_transactions** (1:many)
3. **users** → **raid_campaigns** (community_leader_id, 1:many)
4. **raid_campaigns** → **campaign_participants** (1:many)
5. **campaign_participants** → **engagement_verifications** (1:many)
6. **campaign_participants** → **reward_distributions** (1:many)

### Foreign Key Constraints
- All foreign keys have proper CASCADE rules for data integrity
- Indexes on foreign key columns for query performance
- Unique constraints on critical fields (email, wallet addresses)

## Data Types

### Decimal Precision
- **Credit amounts**: DECIMAL(20,6) for high precision financial data
- **Token amounts**: DECIMAL(20,6) for fractional token amounts
- **Percentages**: DECIMAL(5,2) for percentage values

### Timestamps
- **created_at**: Record creation timestamp
- **updated_at**: Last modification timestamp
- **Custom timestamps**: For specific events (participated_at, rewarded_at)

### Enums
- **user_type**: 'community_leader', 'community_member'
- **transaction_type**: 'purchase', 'spend', 'refund', 'bonus'
- **campaign_status**: 'draft', 'active', 'paused', 'completed', 'cancelled'
- **verification_status**: 'pending', 'verified', 'failed'

## Migration Strategy

### Initial Setup
1. Create database and user
2. Run schema creation scripts
3. Create indexes for performance
4. Set up initial admin user

### Future Migrations
- Use versioned migration files
- Test migrations on staging environment
- Backup data before major schema changes
- Document all schema changes

---

*This schema provides the foundation for all EngageReward MVP functionality. For API specifications and implementation details, see the related documentation.*
