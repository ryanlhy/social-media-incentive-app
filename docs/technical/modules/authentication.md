# Authentication Module - EngageReward MVP

## Overview

This document details the authentication module for the EngageReward MVP platform. The module handles user registration, login, Twitter OAuth, and JWT token management.

## Components

### Core Services
- **User Registration Service**: Handle new user account creation
- **Twitter OAuth Service**: Manage Twitter account connections
- **JWT Token Management**: Generate and verify authentication tokens
- **Password Hashing Service**: Secure password storage and verification

## Implementation Functions

### 1. User Registration
```javascript
// User registration
async function registerUser(userData) {
  try {
    // Validate input data
    const validation = validateUserData(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Check for existing users
    const existingUser = await checkExistingUser(userData.email, userData.username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Create user record
    const user = await createUserRecord({
      ...userData,
      password: hashedPassword
    });
    
    // Create credit balance record
    await createCreditBalance(user.id);
    
    // Send welcome email
    await sendWelcomeEmail(user.email, user.username);
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        user_type: user.user_type,
        is_verified: false
      }
    };
  } catch (error) {
    console.error('User registration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Validate user registration data
function validateUserData(userData) {
  const errors = [];
  
  // Email validation
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push('Invalid email address');
  }
  
  // Username validation
  if (!userData.username || userData.username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  
  // Password validation
  if (!userData.password || userData.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  // User type validation
  if (!['community_leader', 'community_member'].includes(userData.user_type)) {
    errors.push('Invalid user type');
  }
  
  // Solana wallet validation
  if (!userData.solana_wallet_address || !isValidSolanaAddress(userData.solana_wallet_address)) {
    errors.push('Invalid Solana wallet address');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}
```

### 2. Twitter OAuth Connection
```javascript
// Twitter OAuth connection
async function connectTwitter(oauthCode) {
  try {
    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(oauthCode);
    if (!tokenResponse.success) {
      throw new Error('Failed to exchange code for token');
    }
    
    // Get user info from Twitter
    const userInfo = await getUserInfo(tokenResponse.access_token);
    if (!userInfo.success) {
      throw new Error('Failed to get user info from Twitter');
    }
    
    // Update user record
    const updatedUser = await updateUserTwitterInfo(
      userInfo.user_id,
      userInfo.username,
      tokenResponse.access_token,
      tokenResponse.refresh_token
    );
    
    return {
      success: true,
      twitter_connected: true,
      message: 'Twitter account connected successfully'
    };
  } catch (error) {
    console.error('Twitter connection failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Exchange OAuth code for access token
async function exchangeCodeForToken(code) {
  try {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${twitterConfig.clientId}:${twitterConfig.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: twitterConfig.callbackUrl,
        code_verifier: getCodeVerifier()
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error_description || data.error);
    }
    
    return {
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in
    };
  } catch (error) {
    console.error('Token exchange failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 3. JWT Token Management
```javascript
// JWT token generation
function generateJWT(userId) {
  try {
    const payload = {
      userId: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256'
    });
    
    return {
      success: true,
      token: token
    };
  } catch (error) {
    console.error('JWT generation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// JWT verification
function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    
    return {
      success: true,
      user: decoded
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Refresh JWT token
async function refreshJWT(refreshToken) {
  try {
    // Verify refresh token
    const refreshPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Generate new access token
    const newToken = generateJWT(refreshPayload.userId);
    
    return {
      success: true,
      token: newToken.token
    };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 4. Password Hashing
```javascript
// Hash password
async function hashPassword(password) {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Password processing failed');
  }
}

// Verify password
async function verifyPassword(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}
```

### 5. User Login
```javascript
// User login
async function loginUser(email, password) {
  try {
    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // Check if user is active
    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }
    
    // Generate JWT token
    const tokenResult = generateJWT(user.id);
    if (!tokenResult.success) {
      throw new Error('Authentication failed');
    }
    
    // Log login attempt
    await logLoginAttempt(user.id, true);
    
    return {
      success: true,
      token: tokenResult.token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        user_type: user.user_type
      }
    };
  } catch (error) {
    console.error('Login failed:', error);
    
    // Log failed login attempt
    if (error.message !== 'Invalid credentials') {
      await logLoginAttempt(null, false, email);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}
```

## Security Measures

### Password Security
- **Salt Rounds**: 12 rounds for bcrypt hashing
- **Minimum Length**: 8 characters
- **Complexity Requirements**: Enforced during registration
- **Password History**: Prevent reuse of recent passwords

### JWT Security
- **Secret Key**: Strong, randomly generated secret
- **Expiration**: 24-hour token lifetime
- **Algorithm**: HS256 for signing
- **Refresh Tokens**: Separate refresh token mechanism

### Rate Limiting
```javascript
// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
};
```

### Input Validation
```javascript
// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Solana address
function isValidSolanaAddress(address) {
  const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaRegex.test(address);
}
```

## Error Handling

### Authentication Errors
```javascript
// Handle authentication errors
function handleAuthError(error) {
  switch (error.code) {
    case 'INVALID_CREDENTIALS':
      return { status: 401, message: 'Invalid credentials' };
    case 'ACCOUNT_LOCKED':
      return { status: 403, message: 'Account is locked' };
    case 'TOKEN_EXPIRED':
      return { status: 401, message: 'Token expired' };
    default:
      return { status: 500, message: 'Authentication error' };
  }
}
```

### Validation Errors
```javascript
// Handle validation errors
function handleValidationError(errors) {
  return {
    status: 400,
    message: 'Validation failed',
    details: errors
  };
}
```

## Monitoring and Logging

### Authentication Events
```javascript
// Log authentication events
function logAuthEvent(event, details) {
  logger.info('Authentication Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
    ip: details.ip || null,
    userAgent: details.userAgent || null
  });
}
```

### Security Monitoring
- **Failed Login Attempts**: Track and alert on suspicious activity
- **Account Lockouts**: Monitor for brute force attacks
- **Token Usage**: Track JWT token generation and usage
- **OAuth Connections**: Monitor Twitter OAuth success/failure rates

## Testing

### Unit Tests
```javascript
// Test user registration
describe('User Registration', () => {
  test('should register valid user', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      user_type: 'community_member',
      solana_wallet_address: 'valid-solana-address'
    };
    
    const result = await registerUser(userData);
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests
- Test complete OAuth flow
- Test JWT token lifecycle
- Test password hashing and verification
- Test rate limiting functionality

---

*This authentication module provides secure user management and authentication for the EngageReward platform. For implementation details and deployment configuration, see the related documentation.*
