# Twitter API Integration - EngageReward MVP

## Overview

This document details the Twitter API integration for the EngageReward MVP platform. The integration handles user authentication, engagement verification, and real-time webhook processing.

## Required Twitter API Endpoints

### User Management
- **GET `/2/users/by/username/{username}`** - Get user by username
- **GET `/2/users/{id}/tweets`** - Get user tweets
- **GET `/2/tweets/{id}`** - Get specific tweet

### Engagement Verification
- **GET `/2/tweets/{id}/liking_users`** - Get users who liked tweet
- **GET `/2/tweets/{id}/retweeted_by`** - Get users who retweeted
- **GET `/2/tweets/{id}/quote_tweets`** - Get quote tweets
- **GET `/2/tweets/search/recent`** - Search recent tweets

## Twitter OAuth Flow

### 1. Authorization URL
```
https://twitter.com/i/oauth2/authorize
```

**Parameters:**
- `response_type`: code
- `client_id`: Your Twitter App Client ID
- `redirect_uri`: Your callback URL
- `scope`: tweet.read users.read offline.access
- `state`: Random string for CSRF protection

### 2. Token URL
```
https://api.twitter.com/2/oauth2/token
```

**Required Scopes:**
- `tweet.read` - Read tweet data
- `users.read` - Read user profile data
- `offline.access` - Refresh token access

### 3. OAuth Configuration
```javascript
const twitterConfig = {
  apiKey: process.env.TWITTER_API_KEY,
  apiSecret: process.env.TWITTER_API_SECRET,
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
  callbackUrl: process.env.TWITTER_CALLBACK_URL
};
```

## Twitter Webhook Setup

### Webhook Configuration
- **Webhook URL**: `https://api.engagereward.app/webhooks/twitter`
- **Environment**: Production
- **Events**: `tweet.create`, `tweet.favorite`, `tweet.retweet`

### Webhook Events

#### Tweet Create Event
```json
{
  "tweet_create_events": [
    {
      "id": "1234567890",
      "text": "Tweet content",
      "user": {
        "id": "123456",
        "screen_name": "username"
      },
      "created_at": "Wed Oct 10 20:19:24 +0000 2018"
    }
  ]
}
```

#### Tweet Favorite Event
```json
{
  "favorite_events": [
    {
      "id": "1234567890",
      "user": {
        "id": "123456",
        "screen_name": "username"
      },
      "target_object": {
        "id": "9876543210"
      }
    }
  ]
}
```

#### Tweet Retweet Event
```json
{
  "retweet_events": [
    {
      "id": "1234567890",
      "user": {
        "id": "123456",
        "screen_name": "username"
      },
      "retweeted_status": {
        "id": "9876543210"
      }
    }
  ]
}
```

## Implementation Functions

### 1. User Authentication
```javascript
// Exchange authorization code for access token
async function exchangeCodeForToken(code) {
  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: callbackUrl,
      code_verifier: codeVerifier
    })
  });
  
  return response.json();
}

// Get user info from Twitter
async function getUserInfo(accessToken) {
  const response = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  return response.json();
}
```

### 2. Engagement Verification
```javascript
// Verify like engagement
async function verifyLike(tweetId, username) {
  const response = await fetch(
    `https://api.twitter.com/2/tweets/${tweetId}/liking_users`,
    {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    }
  );
  
  const data = await response.json();
  return data.data.some(user => user.username === username);
}

// Verify retweet engagement
async function verifyRetweet(tweetId, username) {
  const response = await fetch(
    `https://api.twitter.com/2/tweets/${tweetId}/retweeted_by`,
    {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    }
  );
  
  const data = await response.json();
  return data.data.some(user => user.username === username);
}

// Verify comment engagement
async function verifyComment(tweetId, username) {
  const response = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?query=to:${tweetId}`,
    {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    }
  );
  
  const data = await response.json();
  return data.data.some(tweet => tweet.author_id === username);
}
```

### 3. Webhook Processing
```javascript
// Process incoming webhook events
async function processWebhookEvent(event) {
  switch (event.type) {
    case 'tweet.create':
      await handleTweetCreate(event);
      break;
    case 'tweet.favorite':
      await handleTweetFavorite(event);
      break;
    case 'tweet.retweet':
      await handleTweetRetweet(event);
      break;
    default:
      console.log('Unknown event type:', event.type);
  }
}

// Handle tweet creation events
async function handleTweetCreate(event) {
  const tweet = event.tweet_create_events[0];
  // Process new tweet for campaign verification
  await verifyCampaignEngagement(tweet);
}

// Handle tweet favorite events
async function handleTweetFavorite(event) {
  const favorite = event.favorite_events[0];
  // Process like for campaign verification
  await verifyLikeEngagement(favorite);
}

// Handle tweet retweet events
async function handleTweetRetweet(event) {
  const retweet = event.retweet_events[0];
  // Process retweet for campaign verification
  await verifyRetweetEngagement(retweet);
}
```

## Error Handling

### Rate Limiting
```javascript
// Handle Twitter API rate limits
async function handleRateLimit(response) {
  if (response.status === 429) {
    const resetTime = response.headers.get('x-rate-limit-reset');
    const waitTime = (resetTime * 1000) - Date.now();
    
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    return true; // Retry request
  }
  
  return false;
}
```

### API Errors
```javascript
// Handle Twitter API errors
async function handleTwitterError(error) {
  switch (error.code) {
    case 401:
      // Unauthorized - refresh token or re-authenticate
      await refreshUserToken(userId);
      break;
    case 403:
      // Forbidden - user revoked access
      await deactivateUserAccount(userId);
      break;
    case 404:
      // Tweet not found - may have been deleted
      await markEngagementAsFailed(engagementId);
      break;
    default:
      // Log error for monitoring
      console.error('Twitter API error:', error);
  }
}
```

## Security Considerations

### Token Management
- Store access tokens securely (encrypted)
- Implement token refresh logic
- Monitor token expiration
- Handle token revocation gracefully

### Webhook Security
- Verify webhook signatures
- Validate event authenticity
- Implement webhook retry logic
- Monitor webhook delivery status

### Rate Limiting
- Respect Twitter API rate limits
- Implement exponential backoff
- Cache responses when appropriate
- Monitor API usage

## Monitoring and Logging

### Key Metrics
- API call success/failure rates
- Response times
- Rate limit hits
- Webhook delivery success
- User authentication success

### Logging
```javascript
// Log Twitter API interactions
function logTwitterAPI(action, details) {
  logger.info('Twitter API', {
    action,
    details,
    timestamp: new Date().toISOString(),
    userId: details.userId || null
  });
}
```

## Testing

### Unit Tests
- Mock Twitter API responses
- Test OAuth flow
- Test engagement verification
- Test webhook processing

### Integration Tests
- Test with Twitter API sandbox
- Verify webhook delivery
- Test rate limiting handling
- Test error scenarios

---

*This Twitter API integration provides the foundation for social media engagement verification in the EngageReward platform. For implementation details and deployment configuration, see the related documentation.*
