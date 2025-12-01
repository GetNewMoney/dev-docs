# New Money Stablecoin API

**Developer Documentation for the New Money Minting API**

> **Status: Development Environment (Beta v0.1)**
>
> This API is currently in beta testing. Features and endpoints may change. We are actively developing real-time bank integration for fiat deposit verification.

---

## What is New Money?

New Money provides a simple API for minting NZD-backed stablecoins (dNZD1) on Ethereum networks. Our platform enables businesses to:

- Mint stablecoins programmatically via API
- Track transactions in real-time
- Manage prepaid balances
- Integrate with existing payment systems

## Quick Links

| Document | Description |
|----------|-------------|
| [Getting Started](docs/getting-started.md) | Request access and make your first API call |
| [API Reference](docs/api-reference.md) | Complete endpoint documentation |
| [Authentication](docs/authentication.md) | How to authenticate with the API |
| [Error Handling](docs/errors.md) | Error codes and troubleshooting |
| [Code Examples](examples/) | Ready-to-use code samples |
| [Changelog](CHANGELOG.md) | API version history |

## API Overview

### Base URL

```
https://api.getnewmoney.io
```

### Supported Operations

| Operation | Description | Status |
|-----------|-------------|--------|
| Mint Tokens | Create new dNZD1 stablecoins | Available |
| Check Balance | View remaining prepaid balance | Available |
| Transaction Status | Track mint operation status | Available |
| Bank Verification | Real-time fiat deposit check | Coming Soon |

### Supported Networks

| Network | Environment | Status |
|---------|-------------|--------|
| Sepolia | Testnet | Available |
| Ethereum | Mainnet | Coming Soon |
| Polygon | Mainnet | Coming Soon |
| Base | Mainnet | Coming Soon |

## Getting Access

### Request a Test Account

To get started with the API, you need to request test credentials:

1. **Email us at:** [will@toroa.xyz](mailto:will@toroa.xyz)
2. **Include in your email:**
   - Company name
   - Brief description of your use case
   - Technical contact email
   - Expected monthly volume (approximate)

3. **What you'll receive:**
   - API key for the development environment
   - Initial prepaid balance for testing
   - Access to this documentation

### Timeline

- **Test account creation:** 1-2 business days
- **KYB verification (for production):** 3-5 business days

## Quick Start Example

Once you have your API key, making a mint request is simple:

```bash
curl -X POST https://api.getnewmoney.io/mint \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-api-key-here",
    "amount": 100,
    "chain": "sepolia"
  }'
```

**Response:**
```json
{
  "ok": true,
  "orderId": "355GwpVDbbIPwzBLofNFN8HfY1F",
  "status": "pending",
  "wallet_address": "0x6B4eCa48e033dd34C9cBab0bEbc708C2345b7BB5",
  "amount": 100,
  "remaining_balance": 4900,
  "message": "Mint operation initiated successfully"
}
```

## Architecture Overview

```
┌─────────────────────┐
│   Your Application  │
└──────────┬──────────┘
           │ HTTPS POST
           ▼
┌─────────────────────────────────────┐
│   New Money API Gateway             │
│   ┌─────────────────────────────┐   │
│   │ Security Layer              │   │
│   │ - Rate limiting (10/min)    │   │
│   │ - Request validation        │   │
│   │ - DDoS protection           │   │
│   └─────────────────────────────┘   │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Business Logic                    │
│   - API key validation (SHA256)     │
│   - Balance verification            │
│   - Transaction limits              │
│   - Daily limit tracking            │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Blockchain Layer                  │
│   - Stablecoin minting (dNZD1)      │
│   - On-chain transaction            │
│   - Wallet management               │
└─────────────────────────────────────┘
```

## Security Features

- **API Key Authentication** - SHA256 hashed keys
- **Rate Limiting** - 10 requests per minute per IP
- **Request Validation** - Type checking and sanitization
- **Balance Enforcement** - Prepaid balance system
- **Transaction Limits** - Per-transaction and daily limits
- **HTTPS Only** - All communications encrypted

## Development Roadmap

### Current Version (v0.1 Beta)

- [x] Core minting API
- [x] API key authentication
- [x] Prepaid balance system
- [x] Rate limiting
- [x] Sepolia testnet support

### Coming Soon

- [ ] Real-time bank integration (fiat deposit verification)
- [ ] Webhook notifications for transaction status
- [ ] Multiple network support (Ethereum, Polygon, Base)
- [ ] SDK libraries (JavaScript, Python)
- [ ] Dashboard for account management

## Feature Requests & Bug Reports

We welcome your feedback! To request new features or report issues:

**GitHub Issues:** [GetNewMoney/dev-docs/issues](https://github.com/GetNewMoney/dev-docs/issues)

When creating an issue, please include:
- Clear description of the feature/bug
- Use case (why this is needed)
- Expected behavior
- Current behavior (for bugs)
- Code samples if applicable

## Support

| Channel | Purpose | Response Time |
|---------|---------|---------------|
| [will@toroa.xyz](mailto:will@toroa.xyz) | Account requests, general inquiries | 1-2 business days |
| [GitHub Issues](https://github.com/GetNewMoney/dev-docs/issues) | Feature requests, bug reports | Reviewed weekly |

## License

This documentation is provided for API integration purposes. The New Money API is a proprietary service.

---

**Version:** 0.1.0-beta
**Last Updated:** December 2025
**Status:** Development Environment
