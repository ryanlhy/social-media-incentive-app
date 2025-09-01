# API Endpoints - EngageReward MVP

## Overview

This document defines all RESTful API endpoints for the EngageReward MVP platform. The API follows REST conventions and uses JSON for request/response formats.

## Base URL
```
https://api.engagereward.app/v1
```

## Authentication

All endpoints (except registration and login) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format

All API responses follow this standard format:
```json
{
  "success": true|false,
  "data": {...},
  "message": "string",
  "error": "string (if success: false)"
}
```

## Authentication Endpoints

### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "string",
  "username": "string",
  "user_type": "community_leader|community_member",
  "solana_wallet_address": "string",
  "twitter_handle": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "string",
    "username": "string",
    "user_type": "string",
    "is_verified": false
  },
  "message": "Registration successful"
}
```

### POST `/api/auth/twitter/connect`
Connect Twitter account via OAuth.

**Request Body:**
```json
{
  "twitter_oauth_code": "string"
}
```

**Response:**
```json
{
  "success": true,
  "twitter_connected": true,
  "message": "Twitter account connected successfully"
}
```

### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "string",
    "username": "string",
    "user_type": "string"
  }
}
```

## Community Leader Endpoints

### GET `/api/community-leader/dashboard`
Get community leader dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "credit_balance": "decimal",
    "active_campaigns": [
      {
        "id": "uuid",
        "campaign_name": "string",
        "status": "string",
        "participants_count": "integer"
      }
    ],
    "recent_transactions": [
      {
        "id": "uuid",
        "type": "string",
        "amount": "decimal",
        "status": "string",
        "created_at": "timestamp"
      }
    ]
  }
}
```

### POST `/api/community-leader/credits/purchase`
Request to purchase credits with USDC.

**Request Body:**
```json
{
  "amount": "decimal"
}
```

**Response:**
```json
{
  "success": true,
  "platform_wallet_address": "string",
  "amount": "decimal",
  "message": "Please send USDC to the provided wallet address"
}
```

### GET `/api/community-leader/credits/balance`
Get current credit balance and transaction history.

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": "decimal",
    "total_earned": "decimal",
    "total_spent": "decimal",
    "transactions": [
      {
        "id": "uuid",
        "type": "string",
        "amount": "decimal",
        "status": "string",
        "created_at": "timestamp"
      }
    ]
  }
}
```

### POST `/api/community-leader/campaigns`
Create a new raid campaign.

**Request Body:**
```json
{
  "campaign_name": "string",
  "x_post_url": "string",
  "total_budget": "decimal",
  "reward_per_like": "decimal",
  "reward_per_comment": "decimal",
  "reward_per_retweet": "decimal",
  "token_airdrop_amount": "decimal",
  "token_contract_address": "string"
}
```

**Response:**
```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "campaign_name": "string",
    "status": "draft",
    "total_budget": "decimal"
  },
  "message": "Campaign created successfully"
}
```

### GET `/api/community-leader/campaigns/{id}`
Get campaign details with participant list.

**Response:**
```json
{
  "success": true,
  "campaign": {
    "id": "uuid",
    "campaign_name": "string",
    "x_post_url": "string",
    "status": "string",
    "participants": [
      {
        "id": "uuid",
        "username": "string",
        "status": "string",
        "total_earned": "decimal"
      }
    ]
  }
}
```

### PUT `/api/community-leader/campaigns/{id}/status`
Update campaign status.

**Request Body:**
```json
{
  "status": "active|paused|cancelled"
}
```

### POST `/api/community-leader/campaigns/{id}/invite`
Invite participants to campaign.

**Request Body:**
```json
{
  "twitter_handles": ["string"]
}
```

## Community Member Endpoints

### GET `/api/community-member/invitations`
Get pending campaign invitations.

**Response:**
```json
{
  "success": true,
  "invitations": [
    {
      "campaign_id": "uuid",
      "campaign_name": "string",
      "community_leader": "string",
      "total_budget": "decimal"
    }
  ]
}
```

### POST `/api/community-member/campaigns/{id}/join`
Join a raid campaign.

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined campaign"
}
```

### GET `/api/community-member/campaigns/active`
Get active campaigns the member is participating in.

**Response:**
```json
{
  "success": true,
  "campaigns": [
    {
      "id": "uuid",
      "campaign_name": "string",
      "x_post_url": "string",
      "status": "string",
      "total_earned": "decimal"
    }
  ]
}
```

### POST `/api/community-member/engagement/verify`
Submit engagement for verification.

**Request Body:**
```json
{
  "campaign_id": "uuid",
  "engagement_type": "like|comment|retweet",
  "x_engagement_id": "string"
}
```

**Response:**
```json
{
  "success": true,
  "verification": {
    "id": "uuid",
    "status": "pending",
    "reward_amount": "decimal"
  },
  "message": "Engagement submitted for verification"
}
```

### GET `/api/community-member/rewards`
Get earned rewards and pending distributions.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_earned": "decimal",
    "pending_rewards": "decimal",
    "distributions": [
      {
        "id": "uuid",
        "usdc_amount": "decimal",
        "token_amount": "decimal",
        "status": "string",
        "created_at": "timestamp"
      }
    ]
  }
}
```

## Transaction Monitor Endpoints

### GET `/api/monitor/transactions/pending`
Get pending transactions requiring verification.

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "amount": "decimal",
      "solana_hash": "string",
      "sender_address": "string",
      "created_at": "timestamp"
    }
  ]
}
```

### POST `/api/monitor/transactions/{id}/verify`
Verify a pending transaction.

**Request Body:**
```json
{
  "status": "confirmed|failed",
  "notes": "string"
}
```

### GET `/api/monitor/wallet/balance`
Get platform wallet balance.

**Response:**
```json
{
  "success": true,
  "balance": "decimal",
  "usdc_balance": "decimal"
}
```

## Admin Endpoints

### GET `/api/admin/users`
Get user list with filters.

**Query Parameters:**
- `user_type`: community_leader|community_member
- `is_active`: true|false
- `page`: integer
- `limit`: integer

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "email": "string",
      "username": "string",
      "user_type": "string",
      "is_active": "boolean",
      "created_at": "timestamp"
    }
  ],
  "pagination": {
    "page": "integer",
    "limit": "integer",
    "total": "integer"
  }
}
```

### PUT `/api/admin/users/{id}/status`
Update user status.

**Request Body:**
```json
{
  "is_active": "boolean"
}
```

### GET `/api/admin/transactions`
Get transaction list with filters.

### POST `/api/admin/rewards/distribute`
Distribute rewards for a campaign.

**Request Body:**
```json
{
  "campaign_id": "uuid"
}
```

## Error Handling

### Standard Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request parameters",
  "details": {...}
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Rate Limiting

- **Authentication endpoints**: 10 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **Admin endpoints**: 50 requests per minute per admin user

## Pagination

For endpoints that return lists, pagination is supported:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Webhooks

### Twitter Webhook
**URL:** `https://api.engagereward.app/webhooks/twitter`

**Events:**
- `tweet.create`
- `tweet.favorite`
- `tweet.retweet`

---

*This API specification provides complete endpoint documentation for the EngageReward MVP platform. For implementation details and integration examples, see the related documentation.*
