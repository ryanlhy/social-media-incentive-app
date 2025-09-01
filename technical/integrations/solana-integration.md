# Solana Integration - EngageReward MVP

## Overview

This document details the Solana blockchain integration for the EngageReward MVP platform. The integration handles USDC transactions, token airdrops, and wallet management.

## Required Solana RPC Endpoints

### Helius RPC Configuration
- **Provider**: Helius (https://helius.xyz)
- **Network**: Solana Mainnet
- **Features**: Enhanced APIs, Webhooks, Rate Limiting
- **Authentication**: API Key required

### Core RPC Methods (via Helius)
- **GET `/getBalance`** - Get wallet balance
- **GET `/getTransaction`** - Get transaction details
- **POST `/sendTransaction`** - Send transaction
- **GET `/getAccountInfo`** - Get account information

### Token Program Methods (via Helius)
- **GET `/getTokenAccountsByOwner`** - Get token accounts
- **POST `/createTransferInstruction`** - Create transfer instruction
- **POST `/createAssociatedTokenAccount`** - Create token account

### Helius Enhanced Features
- **Enhanced Transaction Parsing**: Better transaction data extraction
- **Webhook Support**: Real-time transaction notifications
- **Rate Limiting**: Managed API rate limits
- **Enhanced APIs**: Additional endpoints for better data access

## USDC Token Integration

### USDC Configuration
- **USDC Mint Address**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **Token Program**: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`
- **Decimals**: 6
- **Network**: Solana Mainnet

### Solana Configuration (Helius RPC)
```javascript
const solanaConfig = {
  rpcUrl: process.env.HELIUS_RPC_URL, // Helius RPC endpoint
  apiKey: process.env.HELIUS_API_KEY, // Helius API key
  network: process.env.SOLANA_NETWORK, // 'mainnet-beta' or 'devnet'
  platformWallet: process.env.PLATFORM_WALLET_PRIVATE_KEY,
  usdcMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
};
```

## Platform Wallet Management

### Wallet Structure
- **Hot Wallet**: For daily operations and reward distributions
- **Cold Wallet**: For long-term storage of large amounts
- **Multi-signature**: For large transactions (future enhancement)

### Wallet Security
```javascript
// Generate platform wallet
const platformWallet = Keypair.generate();

// Store private key securely
const encryptedPrivateKey = encrypt(platformWallet.secretKey, process.env.ENCRYPTION_KEY);

// Load wallet for transactions
const loadPlatformWallet = () => {
  const decryptedKey = decrypt(encryptedPrivateKey, process.env.ENCRYPTION_KEY);
  return Keypair.fromSecretKey(decryptedKey);
};
```

## Implementation Functions

### 1. USDC Transfer
```javascript
// Transfer USDC to user wallet
async function transferUSDC(fromWallet, toAddress, amount) {
  try {
    const connection = new Connection(solanaConfig.rpcUrl);
    
    // Get USDC mint info
    const usdcMint = new PublicKey(solanaConfig.usdcMint);
    
    // Get or create associated token account for recipient
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      usdcMint,
      new PublicKey(toAddress)
    );
    
    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      fromWallet.publicKey,
      recipientTokenAccount.address,
      new PublicKey(toAddress),
      amount * Math.pow(10, 6) // Convert to smallest unit
    );
    
    // Send transaction
    const transaction = new Transaction().add(transferInstruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    
    return {
      success: true,
      signature: signature,
      amount: amount
    };
  } catch (error) {
    console.error('USDC transfer failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 2. Token Airdrop
```javascript
// Airdrop project tokens to user
async function airdropTokens(tokenMint, toAddress, amount) {
  try {
    const connection = new Connection(solanaConfig.rpcUrl);
    const platformWallet = loadPlatformWallet();
    
    // Get token mint
    const mint = new PublicKey(tokenMint);
    
    // Get or create associated token account for recipient
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      platformWallet,
      mint,
      new PublicKey(toAddress)
    );
    
    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      platformWallet.publicKey,
      recipientTokenAccount.address,
      new PublicKey(toAddress),
      amount
    );
    
    // Send transaction
    const transaction = new Transaction().add(transferInstruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [platformWallet]);
    
    return {
      success: true,
      signature: signature,
      amount: amount
    };
  } catch (error) {
    console.error('Token airdrop failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 3. Balance Checking
```javascript
// Get USDC balance for wallet
async function getUSDCBalance(walletAddress) {
  try {
    const connection = new Connection(solanaConfig.rpcUrl);
    const usdcMint = new PublicKey(solanaConfig.usdcMint);
    
    // Get token accounts for wallet
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      new PublicKey(walletAddress),
      { mint: usdcMint }
    );
    
    if (tokenAccounts.value.length === 0) {
      return 0;
    }
    
    // Get balance of first token account
    const balance = await connection.getTokenAccountBalance(tokenAccounts.value[0].pubkey);
    return balance.value.uiAmount;
  } catch (error) {
    console.error('Failed to get USDC balance:', error);
    return 0;
  }
}

// Get platform wallet balance
async function getPlatformWalletBalance() {
  try {
    const connection = new Connection(solanaConfig.rpcUrl);
    const platformWallet = loadPlatformWallet();
    
    const balance = await getUSDCBalance(platformWallet.publicKey.toString());
    return balance;
  } catch (error) {
    console.error('Failed to get platform wallet balance:', error);
    return 0;
  }
}
```

### 4. Transaction Monitoring
```javascript
// Monitor incoming transactions
async function monitorIncomingTransactions() {
  try {
    const connection = new Connection(solanaConfig.rpcUrl);
    const platformWallet = loadPlatformWallet();
    
    // Get recent transactions
    const signatures = await connection.getSignaturesForAddress(
      platformWallet.publicKey,
      { limit: 10 }
    );
    
    for (const sig of signatures) {
      const transaction = await connection.getTransaction(sig.signature);
      
      if (transaction && isUSDCTransfer(transaction)) {
        await processIncomingUSDC(transaction);
      }
    }
  } catch (error) {
    console.error('Transaction monitoring failed:', error);
  }
}

// Check if transaction is USDC transfer
function isUSDCTransfer(transaction) {
  // Check if transaction involves USDC mint
  const usdcMint = new PublicKey(solanaConfig.usdcMint);
  
  return transaction.meta.postTokenBalances.some(balance => 
    balance.mint === usdcMint.toString()
  );
}

// Process incoming USDC transaction
async function processIncomingUSDC(transaction) {
  try {
    const sender = transaction.transaction.message.accountKeys[0];
    const amount = getTransferAmount(transaction);
    
    // Find pending credit purchase
    const pendingPurchase = await findPendingCreditPurchase(sender.toString());
    
    if (pendingPurchase) {
      await confirmCreditPurchase(pendingPurchase.id, transaction.signature, amount);
    }
  } catch (error) {
    console.error('Failed to process incoming USDC:', error);
  }
}
```

## Error Handling

### Transaction Errors
```javascript
// Handle transaction failures
async function handleTransactionError(error, operation) {
  switch (error.code) {
    case 'INSUFFICIENT_FUNDS':
      await logInsufficientFunds(operation);
      break;
    case 'INVALID_ACCOUNT':
      await logInvalidAccount(operation);
      break;
    case 'BLOCKHASH_NOT_FOUND':
      // Retry with new blockhash
      await retryTransaction(operation);
      break;
    default:
      console.error('Transaction error:', error);
      await logTransactionError(operation, error);
  }
}
```

### Network Errors
```javascript
// Handle network connectivity issues
async function handleNetworkError(error) {
  if (error.message.includes('fetch')) {
    // Network connectivity issue
    await retryWithBackoff(operation, 3);
  } else if (error.message.includes('timeout')) {
    // Request timeout
    await retryWithBackoff(operation, 2);
  } else {
    // Unknown network error
    console.error('Network error:', error);
  }
}
```

## Security Measures

### Private Key Management
- Encrypt private keys at rest
- Use environment variables for sensitive data
- Implement key rotation procedures
- Monitor wallet access logs

### Transaction Validation
- Validate transaction parameters
- Check wallet balances before transfers
- Implement transaction limits
- Monitor for suspicious activity

### Network Security
- Use HTTPS for Helius RPC connections
- Validate Helius API key and endpoint authenticity
- Implement request signing with Helius API key
- Monitor for network attacks and API rate limits
- Use Helius webhooks for real-time transaction monitoring

## Monitoring and Logging

### Key Metrics
- Transaction success/failure rates
- Network response times
- Wallet balance changes
- Gas fee costs
- Error rates by operation type

### Logging
```javascript
// Log Solana transactions
function logSolanaTransaction(operation, details) {
  logger.info('Solana Transaction', {
    operation,
    details,
    timestamp: new Date().toISOString(),
    signature: details.signature || null,
    amount: details.amount || null
  });
}
```

## Testing

### Unit Tests
- Mock Solana RPC responses
- Test transaction creation
- Test balance checking
- Test error handling

### Integration Tests
- Test with Solana devnet
- Verify transaction confirmation
- Test wallet operations
- Test network error scenarios

### Test Configuration
```javascript
// Test environment configuration
const testConfig = {
  rpcUrl: process.env.HELIUS_DEVNET_RPC_URL, // Helius devnet endpoint
  apiKey: process.env.HELIUS_API_KEY, // Same API key for devnet
  network: 'devnet',
  platformWallet: testWalletKeypair,
  usdcMint: 'devnet-usdc-mint-address'
};
```

---

*This Solana integration provides the blockchain infrastructure for USDC transactions and token airdrops in the EngageReward platform. For implementation details and deployment configuration, see the related documentation.*
