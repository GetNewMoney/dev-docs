# Testing Guide

How to test your integration with the New Money API.

---

## Development Environment

The New Money API is currently available in a **development/beta environment**. All transactions are performed on the Sepolia testnet.

### Environment Details

| Property | Value |
|----------|-------|
| Status | Beta (v0.1.0) |
| Network | Sepolia (Ethereum testnet) |
| Token | dNZD1 (test stablecoin) |
| Real Money | No (test environment) |

---

## Getting Test Credentials

### Request Process

1. Email [tech@getnewmoney.io](mailto:tech@getnewmoney.io)
2. Include your company name and use case
3. Receive credentials within 1-2 business days

### What You'll Receive

- **API Key**: Your authentication credential
- **Initial Balance**: Test balance (typically $5,000)
- **Transaction Limit**: Per-transaction maximum
- **Daily Limit**: Daily maximum

---

## Test Scenarios

### 1. Successful Mint

Test a basic successful mint operation:

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-test-api-key",
    "amount": 10,
    "chain": "sepolia"
  }'
```

**Expected Response (200 OK):**
```json
{
  "ok": true,
  "orderId": "355GwpVDbbIPwzBLofNFN8HfY1F",
  "status": "pending",
  "wallet_address": "0x...",
  "amount": 10,
  "remaining_balance": 4990
}
```

### 2. Invalid API Key

Test authentication error handling:

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "invalid-key-123",
    "amount": 10,
    "chain": "sepolia"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "ok": false,
  "error": "Invalid API key"
}
```

### 3. Validation Errors

Test various validation scenarios:

**Missing amount:**
```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key"}'
```

**Invalid amount type:**
```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": "not-a-number"}'
```

**Amount too high:**
```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 15000}'
```

### 4. Insufficient Balance

Test balance checking:

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-api-key",
    "amount": 100000
  }'
```

**Expected Response (402 Payment Required):**
```json
{
  "ok": false,
  "error": "Insufficient balance",
  "amount": 100000,
  "balance": 5000
}
```

### 5. Rate Limiting

Test rate limit handling by sending multiple rapid requests:

```bash
for i in {1..15}; do
  echo "Request $i:"
  curl -s -X POST https://dev-dnzd.newmoney-api.workers.dev \
    -H "Content-Type: application/json" \
    -d '{"apiKey":"your-api-key","amount":1}' | jq -r '.ok // .error'
done
```

**Expected:** First 10 succeed, then rate limit errors.

---

## Verify on Blockchain

After a successful mint, verify the transaction on the blockchain:

### Sepolia (Testnet)

1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Search for your wallet address (from response)
3. Look for ERC-20 token transfers
4. Verify the dNZD1 token amount

### What to Check

- Transaction status (confirmed)
- Token amount matches request
- Recipient address matches your wallet
- Block timestamp

---

## Integration Testing Checklist

Use this checklist to verify your integration:

### Authentication
- [ ] Valid API key returns success
- [ ] Invalid API key returns 401
- [ ] Missing API key returns 400

### Amount Validation
- [ ] Positive amounts succeed
- [ ] Zero amount returns error
- [ ] Negative amount returns error
- [ ] Amount > balance returns 402
- [ ] Amount > transaction limit returns error
- [ ] Amount with >2 decimals returns error

### Chain Validation
- [ ] Valid chain succeeds
- [ ] Invalid chain returns error
- [ ] Missing chain uses default (sepolia)

### Rate Limiting
- [ ] Requests under limit succeed
- [ ] Exceeding limit returns 429
- [ ] Retry-After header is respected

### Error Handling
- [ ] All error responses are JSON
- [ ] Error messages are actionable
- [ ] HTTP status codes are correct

---

## Test Data

### Sample Valid Request

```json
{
  "apiKey": "your-test-api-key",
  "amount": 100,
  "chain": "sepolia"
}
```

### Amount Boundaries

| Test | Amount | Expected |
|------|--------|----------|
| Minimum | 0.01 | Success |
| Maximum | 10000 | Success (or limit) |
| Below minimum | 0.001 | Error |
| Above maximum | 15000 | Error |
| Zero | 0 | Error |
| Negative | -100 | Error |

### Invalid Inputs

| Test | Value | Expected Error |
|------|-------|----------------|
| Amount as string | "100" | "amount must be a number" |
| Empty API key | "" | "Missing required field: apiKey" |
| Special characters | "key@123" | "Invalid API key format" |

---

## Automated Testing

### Example Test Suite (JavaScript)

```javascript
const assert = require('assert');

const API_URL = 'https://dev-dnzd.newmoney-api.workers.dev';
const API_KEY = process.env.NEWMONEY_API_KEY;

async function testMint(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return {
    status: response.status,
    data: await response.json()
  };
}

// Test: Valid mint
async function testValidMint() {
  const { status, data } = await testMint({
    apiKey: API_KEY,
    amount: 10,
    chain: 'sepolia'
  });

  assert.strictEqual(status, 200);
  assert.strictEqual(data.ok, true);
  assert.ok(data.orderId);
  console.log('✓ Valid mint test passed');
}

// Test: Invalid API key
async function testInvalidApiKey() {
  const { status, data } = await testMint({
    apiKey: 'invalid-key',
    amount: 10
  });

  assert.strictEqual(status, 401);
  assert.strictEqual(data.ok, false);
  console.log('✓ Invalid API key test passed');
}

// Test: Missing amount
async function testMissingAmount() {
  const { status, data } = await testMint({
    apiKey: API_KEY
  });

  assert.strictEqual(status, 400);
  console.log('✓ Missing amount test passed');
}

// Run all tests
async function runTests() {
  await testValidMint();
  await testInvalidApiKey();
  await testMissingAmount();
  console.log('\nAll tests passed!');
}

runTests().catch(console.error);
```

### Example Test Suite (Python)

```python
import os
import requests
import unittest

API_URL = 'https://dev-dnzd.newmoney-api.workers.dev'
API_KEY = os.environ.get('NEWMONEY_API_KEY')


class TestNewMoneyAPI(unittest.TestCase):

    def test_valid_mint(self):
        response = requests.post(API_URL, json={
            'apiKey': API_KEY,
            'amount': 10,
            'chain': 'sepolia'
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data.get('ok'))
        self.assertIn('orderId', data)

    def test_invalid_api_key(self):
        response = requests.post(API_URL, json={
            'apiKey': 'invalid-key',
            'amount': 10
        })
        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertFalse(data.get('ok'))

    def test_missing_amount(self):
        response = requests.post(API_URL, json={
            'apiKey': API_KEY
        })
        self.assertEqual(response.status_code, 400)

    def test_invalid_amount_type(self):
        response = requests.post(API_URL, json={
            'apiKey': API_KEY,
            'amount': 'not-a-number'
        })
        self.assertEqual(response.status_code, 400)

    def test_negative_amount(self):
        response = requests.post(API_URL, json={
            'apiKey': API_KEY,
            'amount': -100
        })
        self.assertEqual(response.status_code, 400)


if __name__ == '__main__':
    unittest.main()
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 on valid key | Key copied incorrectly | Check for whitespace |
| Always get errors | Wrong environment | Verify API URL |
| Rate limited quickly | Testing too fast | Add delays between requests |
| Balance exhausted | Heavy testing | Contact for reset |

### Debug Checklist

1. Print the full request before sending
2. Print the full response including headers
3. Check HTTP status code
4. Parse and print JSON body
5. Compare against documentation examples

---

## Related Documentation

- [API Reference](../docs/api-reference.md)
- [Error Reference](../docs/errors.md)
- [Code Examples](../examples/)
