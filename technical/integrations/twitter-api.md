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
- `scope`: users.read
- `state`: Random string for CSRF protection

### 2. Token URL
```
https://api.twitter.com/2/oauth2/token
```

**Required Scopes:**
- `users.read` - Read user profile data (for handle verification)

**Note:** We only need `users.read` scope because:
- OAuth sign-in itself proves user ownership of the Twitter handle
- Once verified, the handle is marked as owned in our system
- Engagement verification uses public tweet data via app Bearer Token
- No ongoing user permissions are needed after initial verification

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

### 4. Simplified Verification Flow

#### User Registration Process
1. **User connects Twitter account** via OAuth 2.0 Authorization Code Flow with PKCE
2. **Twitter authenticates user** and provides access token
3. **Platform verifies ownership** by successfully getting user's handle
4. **Handle marked as verified** in system - no other user can claim it
5. **Access token discarded** - no ongoing user permissions needed

#### Engagement Verification Process
1. **Use app Bearer Token** to access public tweet data
2. **Monitor public engagement** on creator's posts (likes, retweets, comments)
3. **Cross-reference engagement** with verified user handles in database
4. **No user-specific permissions** required for engagement verification

**Benefits of this approach:**
- **Simpler OAuth flow** - minimal scope requirements
- **Better user experience** - no ongoing permission requests
- **Enhanced security** - users don't grant persistent access
- **Public data access** - creator posts are public domain
- **Eliminates complexity** - no need to manage user access tokens

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

### 1. User Authentication (Handle Verification Only)
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

// Get user info from Twitter (for handle verification)
async function getUserInfo(accessToken) {
  const response = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  return response.json();
}

// Verify and store user handle ownership
async function verifyUserHandle(accessToken) {
  try {
    const userInfo = await getUserInfo(accessToken);
    const handle = userInfo.data.username;
    
    // Mark handle as verified in our system
    await markHandleAsVerified(handle);
    
    // Discard access token - no ongoing permissions needed
    return {
      success: true,
      handle: handle,
      verified: true
    };
  } catch (error) {
    console.error('Handle verification failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 2. Engagement Verification (Using App Bearer Token)
```javascript
// Verify like engagement using public data
async function verifyLike(tweetId, username) {
  const response = await fetch(
    `https://api.twitter.com/2/tweets/${tweetId}/liking_users`,
    {
      headers: {
        'Authorization': `Bearer ${bearerToken}` // App Bearer Token, not user token
      }
    }
  );
  
  const data = await response.json();
  return data.data.some(user => user.username === username);
}

// Verify retweet engagement using public data
async function verifyRetweet(tweetId, username) {
  const response = await fetch(
    `https://api.twitter.com/2/tweets/${tweetId}/retweeted_by`,
    {
      headers: {
        'Authorization': `Bearer ${bearerToken}` // App Bearer Token, not user token
      }
    }
  );
  
  const data = await response.json();
  return data.data.some(user => user.username === username);
}

// Verify comment engagement using public data
async function verifyComment(tweetId, username) {
  const response = await fetch(
    `https://api.twitter.com/2/tweets/search/recent?query=to:${tweetId}`,
    {
      headers: {
        'Authorization': `Bearer ${bearerToken}` // App Bearer Token, not user token
      }
    }
  );
  
  const data = await response.json();
  return data.data.some(tweet => tweet.author_id === username);
}
```