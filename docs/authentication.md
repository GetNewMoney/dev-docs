# Authentication

How to authenticate with the New Money API.

---

## Overview

The New Money API uses **API key authentication**. Your API key is included in the request body (not headers) for each API call.

> **Security Note:** API keys are hashed using SHA256 before being checked against our database. We never store plain-text API keys.

---

## Getting Your API Key

### Request Process

1. **Email** [tech@getnewmoney.io](mailto:tech@getnewmoney.io) with your company details
2. **Receive** your API key within 1-2 business days
3. **Store** the key securely (you'll only receive it once)

### What You'll Receive

```
Your API Key: abc123-xyz789-def456
Initial Balance: $5,000.00
Transaction Limit: $1,000.00 per transaction
Daily Limit: $10,000.00 per day
```

---

## Using Your API Key

Include your API key in every request body:

```json
{
  "apiKey": "your-api-key-here",
  "amount": 100,
  "chain": "sepolia"
}
```

### Example Request

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "abc123-xyz789-def456",
    "amount": 100,
    "chain": "sepolia"
  }'
```

---

## API Key Format

### Requirements

| Requirement | Value |
|-------------|-------|
| Length | 10-100 characters |
| Characters | Letters (a-z, A-Z), numbers (0-9), hyphens (-), underscores (_) |
| Case sensitive | Yes |

### Valid Examples

```
test-user-key-123
mycompany_api_key_v1
ABC123-DEF456-GHI789
production_key_2025
```

### Invalid Examples

```
key 123          # Contains space
key@123          # Contains @ symbol
abc              # Too short (< 10 characters)
```

---

## Security Best Practices

### Do

- Store API keys in environment variables
- Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate keys periodically
- Use different keys for development and production
- Monitor for unauthorized usage

### Don't

- Hardcode API keys in source code
- Commit API keys to version control
- Share API keys via email or chat
- Expose keys in client-side code (browser, mobile app)
- Log API keys in application logs

### Environment Variables Example

**Linux/macOS:**
```bash
export NEWMONEY_API_KEY="your-api-key-here"
```

**Node.js:**
```javascript
const apiKey = process.env.NEWMONEY_API_KEY;
```

**Python:**
```python
import os
api_key = os.environ.get('NEWMONEY_API_KEY')
```

---

## Error Responses

### Invalid API Key

**HTTP Status:** `401 Unauthorized`

```json
{
  "ok": false,
  "error": "Invalid API key"
}
```

**Causes:**
- API key is incorrect
- API key has been revoked
- API key format is invalid

### Missing API Key

**HTTP Status:** `400 Bad Request`

```json
{
  "error": "Validation failed",
  "details": ["Missing required field: apiKey"]
}
```

### Invalid Format

**HTTP Status:** `400 Bad Request`

```json
{
  "error": "Validation failed",
  "details": ["Invalid API key format"]
}
```

### Account Inactive

**HTTP Status:** `403 Forbidden`

```json
{
  "ok": false,
  "error": "User account is not active",
  "status": "suspended"
}
```

---

## Account Status

Your account can have one of these statuses:

| Status | Description | Can Make Requests |
|--------|-------------|-------------------|
| `active` | Account is operational | Yes |
| `pending` | Account is being set up | No |
| `suspended` | Account is temporarily disabled | No |
| `inactive` | Account has been deactivated | No |

---

## Key Rotation

If you need to rotate your API key:

1. **Contact** [tech@getnewmoney.io](mailto:tech@getnewmoney.io)
2. **Request** a new API key
3. **Update** your application with the new key
4. **Confirm** the old key has been revoked

### Rotation Reasons

- Suspected compromise
- Employee departure
- Periodic security rotation
- Moving to production

---

## Multiple Environments

We recommend using separate API keys for:

| Environment | Purpose |
|-------------|---------|
| Development | Local development and testing |
| Staging | Pre-production testing |
| Production | Live transactions |

Request additional keys by emailing [tech@getnewmoney.io](mailto:tech@getnewmoney.io).

---

## Rate Limits per API Key

| Limit | Value |
|-------|-------|
| Requests per minute | 10 (per IP) |
| Requests per hour | 100 (per API key) |

Exceeding these limits returns `429 Too Many Requests`.

---

## Troubleshooting

### "Invalid API key" but key is correct

1. Check for extra whitespace
2. Verify case sensitivity
3. Confirm the key hasn't been rotated
4. Try copying the key fresh from your secure storage

### Requests work locally but fail in production

1. Ensure environment variables are set correctly
2. Check that production uses the correct key
3. Verify no proxy or firewall is modifying requests

### Key stopped working suddenly

1. Check if account was suspended
2. Verify balance hasn't been exhausted
3. Contact support if issue persists

---

## Related Documentation

- [Getting Started](getting-started.md) - Request your API key
- [API Reference](api-reference.md) - Using the API
- [Error Reference](errors.md) - Authentication errors

---

**Next:** [Error Reference →](errors.md)
