# JavaScript Examples

Complete JavaScript/Node.js examples for the New Money API.

---

## Quick Start

### Basic Mint Request

```javascript
async function mintTokens(apiKey, amount, chain = 'sepolia') {
  const response = await fetch('https://brale-webhook-proxy.andre-426.workers.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiKey: apiKey,
      amount: amount,
      chain: chain
    })
  });

  const data = await response.json();

  if (response.ok && data.ok) {
    console.log('Mint successful!');
    console.log('Order ID:', data.orderId);
    console.log('Remaining balance:', data.remaining_balance);
    return data;
  } else {
    console.error('Mint failed:', data.error || data.details);
    throw new Error(data.error || 'Mint failed');
  }
}

// Usage
mintTokens('your-api-key', 100, 'sepolia')
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

---

## Production-Ready Client

### Full Client Class

```javascript
class NewMoneyClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://brale-webhook-proxy.andre-426.workers.dev';
    this.timeout = options.timeout || 30000;
    this.maxRetries = options.maxRetries || 3;
  }

  async mint(amount, chain = 'sepolia') {
    return this._request({
      apiKey: this.apiKey,
      amount: amount,
      chain: chain
    });
  }

  async _request(body, retries = 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      // Handle rate limiting
      if (response.status === 429 && retries < this.maxRetries) {
        const retryAfter = data.retryAfter || Math.pow(2, retries);
        console.log(`Rate limited. Retrying in ${retryAfter}s...`);
        await this._sleep(retryAfter * 1000);
        return this._request(body, retries + 1);
      }

      // Handle server errors
      if (response.status >= 500 && retries < this.maxRetries) {
        console.log(`Server error. Retrying...`);
        await this._sleep(1000 * Math.pow(2, retries));
        return this._request(body, retries + 1);
      }

      // Handle client errors
      if (!response.ok) {
        const error = new Error(data.error || data.details?.join(', ') || 'Request failed');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      // Handle business logic errors
      if (!data.ok) {
        const error = new Error(data.error || 'Operation failed');
        error.data = data;
        throw error;
      }

      return data;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }

      throw error;
    }
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const client = new NewMoneyClient('your-api-key');

async function main() {
  try {
    const result = await client.mint(100, 'sepolia');
    console.log('Mint successful!');
    console.log('Order ID:', result.orderId);
    console.log('Wallet:', result.wallet_address);
    console.log('Balance:', result.remaining_balance);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.data) {
      console.error('Details:', error.data);
    }
  }
}

main();
```

---

## Express.js Backend Integration

### Complete Express Server

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Store API key securely (use environment variables)
const NEWMONEY_API_KEY = process.env.NEWMONEY_API_KEY;

// Endpoint for your frontend to call
app.post('/api/mint', async (req, res) => {
  const { amount, chain } = req.body;

  // Validate input
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      error: 'Invalid amount'
    });
  }

  try {
    // Call New Money API
    const response = await fetch('https://brale-webhook-proxy.andre-426.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: NEWMONEY_API_KEY,
        amount: amount,
        chain: chain || 'sepolia'
      })
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      // Success - return relevant data to frontend
      res.json({
        success: true,
        orderId: data.orderId,
        amount: data.amount,
        status: data.status
      });
    } else {
      // API error
      res.status(response.status).json({
        success: false,
        error: data.error || 'Mint failed'
      });
    }

  } catch (error) {
    console.error('New Money API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## TypeScript Example

### Type Definitions

```typescript
interface MintRequest {
  apiKey: string;
  amount: number;
  chain?: 'sepolia' | 'ethereum' | 'polygon' | 'base';
}

interface MintResponse {
  ok: boolean;
  orderId?: string;
  status?: 'pending' | 'complete' | 'failed';
  user_name?: string;
  wallet_address?: string;
  amount?: number;
  remaining_balance?: number;
  message?: string;
  error?: string;
  details?: string[];
}

interface NewMoneyClientOptions {
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

class NewMoneyClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;

  constructor(apiKey: string, options: NewMoneyClientOptions = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://brale-webhook-proxy.andre-426.workers.dev';
    this.timeout = options.timeout || 30000;
    this.maxRetries = options.maxRetries || 3;
  }

  async mint(
    amount: number,
    chain: MintRequest['chain'] = 'sepolia'
  ): Promise<MintResponse> {
    const request: MintRequest = {
      apiKey: this.apiKey,
      amount,
      chain
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    const data: MintResponse = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Mint failed');
    }

    return data;
  }
}

// Usage
async function main() {
  const client = new NewMoneyClient('your-api-key');

  try {
    const result = await client.mint(100, 'sepolia');
    console.log(`Minted ${result.amount} to ${result.wallet_address}`);
  } catch (error) {
    console.error('Failed:', error);
  }
}

main();
```

---

## React Hook Example

### useMint Hook

```typescript
import { useState, useCallback } from 'react';

interface UseMintResult {
  mint: (amount: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  result: MintResponse | null;
}

function useMint(): UseMintResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MintResponse | null>(null);

  const mint = useCallback(async (amount: number) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call your backend (which holds the API key)
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Mint failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { mint, loading, error, result };
}

// Usage in component
function MintButton() {
  const { mint, loading, error, result } = useMint();

  const handleMint = () => {
    mint(100);
  };

  return (
    <div>
      <button onClick={handleMint} disabled={loading}>
        {loading ? 'Minting...' : 'Mint 100 dNZD1'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <p>Order ID: {result.orderId}</p>}
    </div>
  );
}
```

---

## Error Handling Patterns

### Comprehensive Error Handler

```javascript
class MintError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'MintError';
    this.status = status;
    this.data = data;
  }
}

async function mintWithErrorHandling(apiKey, amount, chain) {
  const response = await fetch('https://brale-webhook-proxy.andre-426.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, amount, chain })
  });

  const data = await response.json();

  switch (response.status) {
    case 200:
      if (data.ok) return data;
      throw new MintError(data.error, 200, data);

    case 400:
      throw new MintError(
        `Validation error: ${data.details?.join(', ') || data.error}`,
        400,
        data
      );

    case 401:
      throw new MintError('Invalid API key', 401, data);

    case 402:
      throw new MintError(
        `Insufficient balance. Have: $${data.balance}, Need: $${data.amount}`,
        402,
        data
      );

    case 403:
      throw new MintError('Account not active', 403, data);

    case 429:
      throw new MintError(
        `Rate limited. Retry in ${data.retryAfter}s`,
        429,
        data
      );

    default:
      throw new MintError(
        data.error || 'Unknown error',
        response.status,
        data
      );
  }
}

// Usage
try {
  const result = await mintWithErrorHandling('key', 100, 'sepolia');
  console.log('Success:', result);
} catch (error) {
  if (error instanceof MintError) {
    switch (error.status) {
      case 401:
        console.log('Check your API key');
        break;
      case 402:
        console.log('Top up your balance');
        break;
      case 429:
        console.log('Wait before retrying');
        break;
      default:
        console.log('Error:', error.message);
    }
  } else {
    console.log('Network error:', error);
  }
}
```

---

## Environment Configuration

### .env File

```
NEWMONEY_API_KEY=your-api-key-here
NEWMONEY_BASE_URL=https://brale-webhook-proxy.andre-426.workers.dev
```

### Config Module

```javascript
// config.js
require('dotenv').config();

module.exports = {
  newMoney: {
    apiKey: process.env.NEWMONEY_API_KEY,
    baseUrl: process.env.NEWMONEY_BASE_URL || 'https://brale-webhook-proxy.andre-426.workers.dev',
    timeout: parseInt(process.env.NEWMONEY_TIMEOUT) || 30000
  }
};

// Usage
const config = require('./config');
const client = new NewMoneyClient(config.newMoney.apiKey, {
  baseUrl: config.newMoney.baseUrl,
  timeout: config.newMoney.timeout
});
```

---

## Related Documentation

- [API Reference](../docs/api-reference.md)
- [Error Reference](../docs/errors.md)
- [Python Examples](python.md)
