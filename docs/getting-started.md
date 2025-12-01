# Getting Started

Get your first mint operation working in under 10 minutes.

> **Prerequisites**
> - API key from New Money (request at [will@toroa.xyz](mailto:will@toroa.xyz))
> - Basic understanding of REST APIs
> - cURL, Postman, or any HTTP client

---

## Step 1: Request API Access

Before you can use the API, you need to request test credentials.

### Email Template

Send an email to **[will@toroa.xyz](mailto:will@toroa.xyz)** with the following information:

```
Subject: API Access Request - [Your Company Name]

Hi,

We would like to request access to the New Money API for testing.

Company: [Your Company Name]
Use Case: [Brief description of what you're building]
Technical Contact: [Email address]
Expected Volume: [Approximate monthly transactions]

Thank you.
```

### What You'll Receive

Within 1-2 business days, you'll receive:

| Item | Description |
|------|-------------|
| API Key | Your unique authentication key |
| Initial Balance | Prepaid balance for testing (typically $5,000) |
| Transaction Limit | Maximum amount per transaction |
| Daily Limit | Maximum amount per 24 hours |

---

## Step 2: Understand the API Structure

### Endpoint

All requests go to a single endpoint:

```
POST https://api.getnewmoney.io/mint
```

### Request Format

```json
{
  "apiKey": "your-api-key-here",
  "amount": 100,
  "chain": "sepolia"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `apiKey` | string | Yes | Your API authentication key |
| `amount` | number | Yes | Amount in USD to mint (0.01 - 10,000) |
| `chain` | string | No | Blockchain network (default: "sepolia") |

---

## Step 3: Make Your First Request

### Using cURL

```bash
curl -X POST https://api.getnewmoney.io/mint \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-api-key-here",
    "amount": 10,
    "chain": "sepolia"
  }'
```

### Using JavaScript (Node.js)

```javascript
const response = await fetch('https://api.getnewmoney.io/mint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    apiKey: 'your-api-key-here',
    amount: 10,
    chain: 'sepolia'
  })
});

const data = await response.json();
console.log(data);
```

### Using Python

```python
import requests

response = requests.post(
    'https://api.getnewmoney.io/mint',
    json={
        'apiKey': 'your-api-key-here',
        'amount': 10,
        'chain': 'sepolia'
    }
)

print(response.json())
```

---

## Step 4: Understand the Response

### Successful Response (200 OK)

```json
{
  "ok": true,
  "orderId": "355GwpVDbbIPwzBLofNFN8HfY1F",
  "status": "pending",
  "user_name": "Your Company",
  "wallet_address": "0x6B4eCa48e033dd34C9cBab0bEbc708C2345b7BB5",
  "amount": 10,
  "remaining_balance": 4990,
  "message": "Mint operation initiated successfully"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | `true` if request was successful |
| `orderId` | string | Unique identifier for this mint operation |
| `status` | string | Current status: `pending`, `complete`, `failed` |
| `user_name` | string | Your registered company name |
| `wallet_address` | string | Destination wallet for minted tokens |
| `amount` | number | Amount that was minted |
| `remaining_balance` | number | Your remaining prepaid balance |
| `message` | string | Human-readable status message |

---

## Step 5: Verify on Blockchain

Once the mint operation completes, you can verify the transaction on the blockchain explorer.

### Sepolia (Testnet)

1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Search for your wallet address
3. Look for the dNZD1 token transaction

### What to Expect

- **Processing Time:** Usually 10-60 seconds
- **Status:** Changes from `pending` to `complete`
- **Tokens:** dNZD1 tokens will appear in your wallet

---

## Common First-Time Issues

### "Invalid API key"

```json
{
  "ok": false,
  "error": "Invalid API key"
}
```

**Solution:** Double-check your API key. Make sure there are no extra spaces or characters.

### "Insufficient balance"

```json
{
  "ok": false,
  "error": "Insufficient balance",
  "amount": 6000,
  "balance": 5000
}
```

**Solution:** Your requested amount exceeds your prepaid balance. Request a smaller amount or contact us to top up.

### "Rate limit exceeded"

```json
{
  "error": "Rate limit exceeded",
  "limit": 10,
  "retryAfter": 60
}
```

**Solution:** You've made too many requests. Wait 60 seconds before trying again.

---

## Next Steps

Now that you've made your first successful mint:

1. **[Read the API Reference](api-reference.md)** - Learn about all available options
2. **[Understand Error Handling](errors.md)** - Handle edge cases gracefully
3. **[View Code Examples](../examples/)** - Production-ready code samples
4. **[Set Up Webhooks](webhooks.md)** - Get notified when transactions complete (coming soon)

---

## Need Help?

- **Technical Issues:** Create an issue on [GitHub](https://github.com/GetNewMoney/dev-docs/issues)
- **Account Questions:** Email [will@toroa.xyz](mailto:will@toroa.xyz)

---

**Next:** [API Reference →](api-reference.md)
