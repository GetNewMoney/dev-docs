# Best Practices

Recommendations for building robust integrations with the New Money API.

---

## Security

### API Key Management

**Do:**
- Store API keys in environment variables
- Use secrets management services (AWS Secrets Manager, HashiCorp Vault)
- Rotate keys periodically
- Use separate keys for development and production

**Don't:**
- Hardcode API keys in source code
- Commit keys to version control
- Expose keys in client-side code
- Share keys via email or chat
- Log API keys

```javascript
// Good: Environment variable
const apiKey = process.env.NEWMONEY_API_KEY;

// Bad: Hardcoded
const apiKey = 'abc123-xyz789'; // Never do this!
```

### Server-Side Only

Always call the New Money API from your server, never from client-side code:

```
Good:  Browser → Your Server → New Money API
Bad:   Browser → New Money API (exposes your API key!)
```

### Input Validation

Validate all inputs before sending to the API:

```javascript
function validateMintRequest(amount, chain) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Amount must be a number');
  }
  if (amount <= 0 || amount > 10000) {
    throw new Error('Amount out of range');
  }
  if (chain && !['sepolia', 'ethereum', 'polygon'].includes(chain)) {
    throw new Error('Invalid chain');
  }
}
```

---

## Error Handling

### Always Check Response Status

```javascript
const response = await fetch(url, options);
const data = await response.json();

// Check both HTTP status and business logic status
if (!response.ok || !data.ok) {
  // Handle error
}
```

### Handle Specific Error Types

```javascript
switch (response.status) {
  case 400:
    // Validation error - fix your request
    break;
  case 401:
    // Auth error - check API key
    break;
  case 402:
    // Balance error - top up needed
    break;
  case 429:
    // Rate limited - wait and retry
    break;
  case 500:
    // Server error - retry with backoff
    break;
}
```

### Implement Retry Logic

```javascript
async function mintWithRetry(payload, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await mint(payload);
      return response;
    } catch (error) {
      if (error.status === 429 || error.status >= 500) {
        // Retryable error
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await sleep(delay);
        continue;
      }
      throw error; // Non-retryable error
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Rate Limiting

### Respect Rate Limits

The API enforces **10 requests per minute per IP**. Design your application accordingly:

```javascript
class RateLimiter {
  constructor(limit = 10, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();
    // Remove old requests
    this.requests = this.requests.filter(t => now - t < this.windowMs);

    if (this.requests.length >= this.limit) {
      const waitTime = this.windowMs - (now - this.requests[0]);
      await new Promise(r => setTimeout(r, waitTime));
      return this.acquire();
    }

    this.requests.push(now);
    return true;
  }
}

// Usage
const limiter = new RateLimiter();

async function safeMint(payload) {
  await limiter.acquire();
  return mint(payload);
}
```

### Handle 429 Responses

```javascript
if (response.status === 429) {
  const retryAfter = data.retryAfter || 60;
  console.log(`Rate limited. Waiting ${retryAfter}s...`);
  await sleep(retryAfter * 1000);
  return retry();
}
```

---

## Performance

### Connection Pooling

Reuse HTTP connections when making multiple requests:

```python
import requests

# Create a session for connection reuse
session = requests.Session()

def mint(api_key, amount):
    return session.post(
        'https://api.getnewmoney.io/mint',
        json={'apiKey': api_key, 'amount': amount}
    )
```

### Timeouts

Always set appropriate timeouts:

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

try {
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
} finally {
  clearTimeout(timeoutId);
}
```

### Batch Processing

If you need multiple operations, space them out:

```javascript
async function batchMint(amounts) {
  const results = [];
  for (const amount of amounts) {
    const result = await mint(amount);
    results.push(result);
    await sleep(6000); // 6 seconds between requests
  }
  return results;
}
```

---

## Logging

### What to Log

- Request timestamps
- Request IDs / Order IDs
- Response status codes
- Error messages
- Amount and chain (for debugging)

### What NOT to Log

- API keys
- Full request bodies (may contain sensitive data)
- User PII

```javascript
function logRequest(context) {
  console.log({
    timestamp: new Date().toISOString(),
    action: 'mint',
    amount: context.amount,
    chain: context.chain,
    // Don't log: apiKey, user details
  });
}

function logResponse(response) {
  console.log({
    timestamp: new Date().toISOString(),
    status: response.status,
    orderId: response.orderId,
    success: response.ok
  });
}
```

---

## Monitoring

### Track Key Metrics

- Success rate
- Response times
- Error rates by type
- Balance usage

### Set Up Alerts

- Balance running low
- High error rate
- Response time degradation
- Rate limit hits

```javascript
// Example: Alert on low balance
if (response.remaining_balance < 500) {
  sendAlert('Balance running low', {
    balance: response.remaining_balance
  });
}
```

---

## Testing

### Use Test Credentials

- Keep separate API keys for development
- Use the testnet for all development
- Don't test with production credentials

### Test Edge Cases

- Boundary values (min/max amounts)
- Invalid inputs
- Network failures
- Rate limit scenarios
- Timeout handling

### Automated Testing

Include API integration tests in your CI/CD:

```yaml
# Example GitHub Actions
test:
  runs-on: ubuntu-latest
  env:
    NEWMONEY_API_KEY: ${{ secrets.NEWMONEY_TEST_API_KEY }}
  steps:
    - uses: actions/checkout@v3
    - run: npm test
```

---

## Production Readiness

### Checklist

Before going to production, verify:

- [ ] API key stored securely (not in code)
- [ ] Error handling for all status codes
- [ ] Retry logic with exponential backoff
- [ ] Rate limiting respected
- [ ] Timeouts configured
- [ ] Logging implemented (without sensitive data)
- [ ] Monitoring and alerting set up
- [ ] Balance alerts configured
- [ ] Integration tests passing
- [ ] Load testing completed

### Health Checks

Implement health checks for your integration:

```javascript
async function healthCheck() {
  try {
    // Make a small test request
    const response = await mint({ amount: 0.01 });
    return {
      status: 'healthy',
      balance: response.remaining_balance
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}
```

---

## Common Patterns

### Factory Pattern for Client

```javascript
function createNewMoneyClient(config) {
  const { apiKey, maxRetries = 3, timeout = 30000 } = config;

  return {
    async mint(amount, chain = 'sepolia') {
      // Implementation with configured settings
    }
  };
}

// Usage
const client = createNewMoneyClient({
  apiKey: process.env.NEWMONEY_API_KEY,
  maxRetries: 5
});
```

### Queue Pattern for High Volume

```javascript
class MintQueue {
  constructor(client) {
    this.client = client;
    this.queue = [];
    this.processing = false;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const { request, resolve, reject } = this.queue.shift();

    try {
      const result = await this.client.mint(request.amount);
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // Rate limit: wait 6 seconds between requests
    await sleep(6000);
    this.processing = false;
    this.process();
  }
}
```

---

## Related Documentation

- [API Reference](../docs/api-reference.md)
- [Error Reference](../docs/errors.md)
- [Testing Guide](testing.md)
