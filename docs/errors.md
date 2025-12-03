# Error Reference

Complete guide to API errors, status codes, and troubleshooting.

---

## Error Response Format

All error responses follow this structure:

```json
{
  "ok": false,
  "error": "Error type or message",
  "details": ["Additional details if available"]
}
```

Or for validation errors:

```json
{
  "error": "Validation failed",
  "details": ["List of validation errors"]
}
```

---

## HTTP Status Codes

| Code | Name | Description |
|------|------|-------------|
| `200` | OK | Request successful |
| `400` | Bad Request | Invalid request format or parameters |
| `401` | Unauthorized | Invalid or missing API key |
| `402` | Payment Required | Insufficient balance |
| `403` | Forbidden | Account not active or action not allowed |
| `405` | Method Not Allowed | Wrong HTTP method (use POST) |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server-side error |

---

## Error Types

### Authentication Errors (401)

#### Invalid API Key

```json
{
  "ok": false,
  "error": "Invalid API key"
}
```

**Causes:**
- API key is incorrect or misspelled
- API key has been revoked
- API key doesn't exist

**Resolution:**
- Double-check your API key
- Request a new key if necessary
- Contact [tech@getnewmoney.io](mailto:tech@getnewmoney.io)

---

### Validation Errors (400)

#### Missing Required Field

```json
{
  "error": "Validation failed",
  "details": ["Missing required field: apiKey"]
}
```

```json
{
  "error": "Validation failed",
  "details": ["Missing required field: amount"]
}
```

**Resolution:** Include all required fields in your request.

#### Invalid Type

```json
{
  "error": "Validation failed",
  "details": ["apiKey must be a string"]
}
```

```json
{
  "error": "Validation failed",
  "details": ["amount must be a number"]
}
```

**Resolution:** Ensure correct data types. Amount must be a number, not a string.

**Correct:**
```json
{"amount": 100}
```

**Incorrect:**
```json
{"amount": "100"}
```

#### Invalid Amount

```json
{
  "error": "Validation failed",
  "details": ["amount must be greater than 0"]
}
```

```json
{
  "error": "Validation failed",
  "details": ["amount exceeds maximum limit of 10000"]
}
```

```json
{
  "ok": false,
  "error": "Minimum amount is 0.01 USD"
}
```

```json
{
  "ok": false,
  "error": "USD amounts limited to 2 decimal places (e.g., 10.99)"
}
```

**Resolution:**
- Amount must be between 0.01 and 10,000
- Maximum 2 decimal places
- Must be a finite number (no Infinity, NaN)

#### Invalid Chain

```json
{
  "error": "Validation failed",
  "details": ["Invalid chain. Allowed: sepolia, amoy, base, polygon, ethereum"]
}
```

```json
{
  "ok": false,
  "error": "Invalid chain. User is registered for sepolia only"
}
```

**Resolution:** Use a supported chain value that matches your account configuration.

#### Invalid API Key Format

```json
{
  "ok": false,
  "error": "Invalid API key format"
}
```

**Resolution:**
- API key must be 10-100 characters
- Only alphanumeric characters, hyphens, and underscores allowed
- No spaces or special characters

#### Invalid JSON

```json
{
  "error": "Invalid JSON body",
  "details": "Unexpected token..."
}
```

**Resolution:** Ensure your request body is valid JSON.

---

### Balance Errors (402)

#### Insufficient Balance

```json
{
  "ok": false,
  "error": "Insufficient balance",
  "amount": 6000,
  "balance": 5000
}
```

**Resolution:**
- Request a smaller amount
- Contact [tech@getnewmoney.io](mailto:tech@getnewmoney.io) to top up your balance

---

### Limit Errors (400)

#### Transaction Limit Exceeded

```json
{
  "ok": false,
  "error": "Amount exceeds transaction limit of 1000.00 USD",
  "amount": 2000,
  "limit": 1000
}
```

**Resolution:**
- Split into multiple smaller transactions
- Request a limit increase

#### Daily Limit Exceeded

```json
{
  "ok": false,
  "error": "Daily limit exceeded. You can spend 500.00 USD more today",
  "daily_limit": 10000,
  "spent_today": 9500
}
```

**Resolution:**
- Wait until the 24-hour period resets
- Request a limit increase for higher volume

---

### Account Errors (403)

#### Account Not Active

```json
{
  "ok": false,
  "error": "User account is not active"
}
```

**Possible causes:**
- Account setup in progress
- Account temporarily suspended
- Account deactivated

**Resolution:** Contact [tech@getnewmoney.io](mailto:tech@getnewmoney.io)

---

### Rate Limit Errors (429)

#### Too Many Requests

```json
{
  "error": "Rate limit exceeded",
  "limit": 10,
  "retryAfter": 60
}
```

**Resolution:**
- Wait the specified number of seconds
- Implement exponential backoff
- Reduce request frequency

**Example backoff:**
```javascript
async function requestWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const wait = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(r => setTimeout(r, wait));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

### Method Errors (405)

#### Method Not Allowed

```json
{
  "error": "Method not allowed",
  "allowed": ["POST", "OPTIONS"]
}
```

**Resolution:** Use `POST` method for all mint requests.

---

### Server Errors (500)

#### Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Failed to process request",
  "requestId": "abc123-def456"
}
```

**Resolution:**
- Retry the request after a short delay
- If persists, contact support with the `requestId`

---

## Error Handling Best Practices

### 1. Check the `ok` Field

```javascript
const response = await fetch('https://dev-dnzd.newmoney-api.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ apiKey, amount, chain })
});

const data = await response.json();

if (!response.ok || !data.ok) {
  console.error('Error:', data.error || data.details);
  // Handle error
} else {
  console.log('Success:', data.wallet_address);
  // Handle success
}
```

### 2. Handle Specific Error Types

```javascript
function handleError(response, data) {
  switch (response.status) {
    case 400:
      // Validation error - check your input
      console.error('Validation error:', data.details);
      break;
    case 401:
      // Auth error - check API key
      console.error('Authentication failed');
      break;
    case 402:
      // Balance error - need to top up
      console.error('Insufficient balance:', data.balance);
      break;
    case 429:
      // Rate limit - wait and retry
      const retryAfter = data.retryAfter || 60;
      console.log(`Rate limited. Retry in ${retryAfter}s`);
      break;
    case 500:
      // Server error - retry with backoff
      console.error('Server error, retrying...');
      break;
    default:
      console.error('Unknown error:', data);
  }
}
```

### 3. Log Errors for Debugging

```javascript
function logError(error, context) {
  console.error({
    timestamp: new Date().toISOString(),
    error: error.message,
    status: error.status,
    requestId: error.requestId,
    context: context
  });
}
```

### 4. Retry Strategy

```python
import time
import requests

def mint_with_retry(api_key, amount, chain, max_retries=3):
    for attempt in range(max_retries):
        response = requests.post(
            'https://dev-dnzd.newmoney-api.workers.dev',
            json={'apiKey': api_key, 'amount': amount, 'chain': chain}
        )

        if response.status_code == 200:
            return response.json()
        elif response.status_code == 429:
            # Rate limited - wait and retry
            wait_time = 2 ** attempt  # Exponential backoff
            time.sleep(wait_time)
        elif response.status_code >= 500:
            # Server error - retry
            time.sleep(1)
        else:
            # Client error - don't retry
            raise Exception(response.json().get('error', 'Unknown error'))

    raise Exception('Max retries exceeded')
```

---

## Common Issues & Solutions

| Issue | Error | Solution |
|-------|-------|----------|
| Wrong data type | "amount must be a number" | Use `100` not `"100"` |
| Key has spaces | "Invalid API key" | Trim whitespace from key |
| Amount too precise | "2 decimal places" | Round to cents (10.99 not 10.999) |
| Wrong HTTP method | "Method not allowed" | Use POST, not GET |
| Empty body | "Invalid JSON body" | Send valid JSON object |
| Wrong chain | "Invalid chain" | Use registered chain value |

---

## Getting Help

If you encounter persistent errors:

1. **Check this documentation** for the error message
2. **Review your request** against the [API Reference](api-reference.md)
3. **Create a GitHub issue** at [GetNewMoney/dev-docs](https://github.com/GetNewMoney/dev-docs/issues) with:
   - Error message and status code
   - Request details (without API key)
   - Steps to reproduce
4. **Contact support** at [tech@getnewmoney.io](mailto:tech@getnewmoney.io) for account issues

---

## Related Documentation

- [API Reference](api-reference.md) - Correct request format
- [Authentication](authentication.md) - API key requirements
- [Getting Started](getting-started.md) - Basic setup

---

**Next:** [Code Examples →](../examples/)
