# API Reference

Complete reference documentation for the New Money Minting API.

> **Base URL:** `https://dev-dnzd.newmoney-api.workers.dev`
>
> **API Version:** 0.1.0-beta
>
> **Status:** Development Environment

---

## Overview

The New Money API is a REST API that accepts JSON payloads and returns JSON responses. All API requests must be made over HTTPS.

### Content Type

All requests must include the header:

```
Content-Type: application/json
```

### Authentication

Authentication is performed via an API key included in the request body. See [Authentication](authentication.md) for details.

---

## Endpoints

> **Current Version:** Only the mint endpoint is available. A dedicated balance check endpoint is coming soon.

### POST /

Create a new mint order to receive dNZD1 stablecoins.

> **Note:** All requests go to the root endpoint. There is no `/mint` path.

#### Request

```http
POST https://dev-dnzd.newmoney-api.workers.dev
Content-Type: application/json

{
  "apiKey": "your-api-key",
  "amount": 100,
  "chain": "sepolia"
}
```

#### Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `apiKey` | string | **Yes** | - | Your API authentication key |
| `amount` | number | **Yes** | - | Amount in USD to mint |
| `chain` | string | No | `"sepolia"` | Target blockchain network |

#### Parameter Validation

##### apiKey
- **Type:** String
- **Length:** 10-100 characters
- **Format:** Alphanumeric, hyphens, and underscores only
- **Pattern:** `^[a-zA-Z0-9\-_]+$`

##### amount
- **Type:** Number (not string)
- **Minimum:** 0.01 USD
- **Maximum:** 10,000 USD (or your transaction limit, whichever is lower)
- **Precision:** Maximum 2 decimal places (e.g., 10.99)
- **Invalid values:** Negative numbers, zero, NaN, Infinity

##### chain
- **Type:** String
- **Allowed values:** `sepolia`, `ethereum`, `polygon`, `amoy`, `base_sepolia`, `base`, `optimism`, `arbitrum`
- **Note:** Must match the chain configured for your account

#### Response (Success)

**HTTP Status:** `200 OK`

```json
{
  "ok": true,
  "user_name": "Your Company Name",
  "wallet_address": "0x6B4eCa48e033dd34C9cBab0bEbc708C2345b7BB5",
  "amount": 100,
  "remaining_balance": 4900,
  "message": "Mint operation initiated successfully"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | `true` if the request was accepted |
| `user_name` | string | Your registered account name |
| `wallet_address` | string | Ethereum address where tokens will be minted |
| `amount` | number | The amount that was requested |
| `remaining_balance` | number | Your remaining prepaid balance after this transaction |
| `message` | string | Human-readable status message |

#### Response (Error)

See [Error Reference](errors.md) for complete error documentation.

**Example - Invalid API Key (401)**
```json
{
  "ok": false,
  "error": "Invalid API key"
}
```

**Example - Validation Error (400)**
```json
{
  "error": "Validation failed",
  "details": ["amount must be a number"]
}
```

---

## Request/Response Examples

### Minimal Request

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 50}'
```

### Full Request with Chain

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-api-key",
    "amount": 100.50,
    "chain": "sepolia"
  }'
```

### Response with Transaction Details

```json
{
  "ok": true,
  "user_name": "Acme Corp",
  "wallet_address": "0x6B4eCa48e033dd34C9cBab0bEbc708C2345b7BB5",
  "amount": 100.50,
  "remaining_balance": 4899.50,
  "message": "Mint operation initiated successfully"
}
```

---

## Rate Limiting

The API enforces rate limiting to ensure fair usage and system stability.

### Limits

| Limit Type | Value | Window |
|------------|-------|--------|
| Requests per IP | 10 | 1 minute |

### Rate Limit Response

**HTTP Status:** `429 Too Many Requests`

```json
{
  "error": "Rate limit exceeded",
  "limit": 10,
  "retryAfter": 60
}
```

### Headers

When rate limited, the response includes:

| Header | Description |
|--------|-------------|
| `Retry-After` | Seconds to wait before retrying |

### Best Practices

1. **Implement exponential backoff** for retries
2. **Cache responses** where appropriate
3. **Batch operations** when possible
4. **Monitor your usage** to stay within limits

---

## Transaction Limits

In addition to rate limits, there are financial limits on transactions.

### Per-Transaction Limits

| Limit | Value | Description |
|-------|-------|-------------|
| Minimum amount | $0.01 | Smallest mint amount |
| Maximum amount | $10,000 | Default per-transaction limit |
| Your limit | Varies | Set when account is created |

### Daily Limits

| Limit | Value | Description |
|-------|-------|-------------|
| Default daily | $10,000 | Total amount per 24 hours |
| Your limit | Varies | Set when account is created |
| Reset time | 24 hours | From first transaction of the day |

### Prepaid Balance

Your account operates on a prepaid balance system:

1. **Initial balance** is set when account is created
2. **Each transaction** deducts from your balance
3. **Balance is checked** before each mint
4. **Top-ups** require contacting support

---

## Supported Networks

### Available Now

| Network | Chain ID | Value | Environment |
|---------|----------|-------|-------------|
| Sepolia | `sepolia` | Ethereum Testnet | Development |

### Coming Soon

| Network | Chain ID | Value | Environment |
|---------|----------|-------|-------------|
| Ethereum | `ethereum` | Ethereum Mainnet | Production |
| Polygon | `polygon` | Polygon Mainnet | Production |
| Polygon Amoy | `amoy` | Polygon Testnet | Development |
| Base | `base` | Base Mainnet | Production |
| Base Sepolia | `base_sepolia` | Base Testnet | Development |
| Optimism | `optimism` | Optimism Mainnet | Production |
| Arbitrum | `arbitrum` | Arbitrum Mainnet | Production |
| Celo | `celo` | Celo Mainnet | Production |
| Stellar | `stellar` | Stellar Network | Production |
| Solana | `solana` | Solana Mainnet | Production |
| Avalanche | `avalanche` | Avalanche C-Chain | Production |
| BNB Chain | `bnb` | BNB Smart Chain | Production |

---

## Token Information

### dNZD1 Token

| Property | Value |
|----------|-------|
| Name | dNZD1 |
| Type | ERC-20 Stablecoin |
| Backing | 1:1 NZD |
| Decimals | 18 |
| Network | Sepolia (testnet) |

### Contract Addresses

| Network | Contract Address |
|---------|------------------|
| Sepolia | Contact support for address |

---

## Idempotency

Each request generates a unique idempotency key internally. If you need to ensure a request is not processed twice, we recommend:

1. **Track order IDs** returned in responses
2. **Implement your own idempotency** by checking order status before retrying
3. **Wait for confirmation** before submitting new requests

---

## API Versioning

The API is currently in beta (v0.1). Future versions will be announced via:

- This documentation
- Email to registered accounts
- GitHub releases

### Deprecation Policy

When breaking changes are necessary:

1. **30-day notice** before deprecation
2. **Migration guide** provided
3. **Support period** for transition

---

## SDKs (Coming Soon)

Official SDKs are planned for:

- **JavaScript/TypeScript** (npm package)
- **Python** (pip package)
- **Go** (Go module)

In the meantime, see [Code Examples](../examples/) for implementation patterns.

---

## Related Documentation

- [Getting Started](getting-started.md) - First-time setup guide
- [Authentication](authentication.md) - API key details
- [Error Reference](errors.md) - All error codes and meanings
- [Code Examples](../examples/) - Implementation samples

---

**Next:** [Authentication →](authentication.md)
