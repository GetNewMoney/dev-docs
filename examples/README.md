# Code Examples

Ready-to-use code examples for integrating with the New Money API.

---

## Available Examples

| Language | Description | Link |
|----------|-------------|------|
| cURL | Command-line examples | [curl.md](curl.md) |
| JavaScript | Node.js and browser examples | [javascript.md](javascript.md) |
| Python | Python examples with requests | [python.md](python.md) |

---

## Quick Start

### cURL (Simplest)

```bash
curl -X POST https://brale-webhook-proxy.andre-426.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-api-key",
    "amount": 100,
    "chain": "sepolia"
  }'
```

### JavaScript

```javascript
const response = await fetch('https://brale-webhook-proxy.andre-426.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'your-api-key',
    amount: 100,
    chain: 'sepolia'
  })
});

const data = await response.json();
console.log(data);
```

### Python

```python
import requests

response = requests.post(
    'https://brale-webhook-proxy.andre-426.workers.dev',
    json={
        'apiKey': 'your-api-key',
        'amount': 100,
        'chain': 'sepolia'
    }
)

print(response.json())
```

---

## What's Included

Each example file includes:

- **Basic usage** - Simple request/response
- **Production client** - Full-featured client class
- **Error handling** - Proper error management
- **Framework integration** - Express, Flask, etc.
- **Testing examples** - How to test your integration

---

## Coming Soon

- Go examples
- Rust examples
- Official SDK packages

---

## Contributing

Have an example in another language? We welcome contributions!

Open an issue at [GetNewMoney/dev-docs](https://github.com/GetNewMoney/dev-docs/issues).
