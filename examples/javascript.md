# JavaScript

Node.js 18 or later:

```javascript
const apiKey = process.env.NEWMONEY_DEV_API_KEY;

if (!apiKey) {
  throw new Error('NEWMONEY_DEV_API_KEY is required');
}

const response = await fetch('https://devv2-dnzd.newmoney-api.workers.dev', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    apiKey,
    amount: 10,
    chain: 'base_sepolia',
  }),
});

const result = await response.json();

if (!response.ok) {
  throw new Error(`New Money request failed (${response.status}): ${result.error}`);
}

console.log({
  orderId: result.orderId,
  status: result.status,
  paymentReference: result.payment.reference,
  expiresAt: result.payment.expires_at,
});
```

Use this from a trusted backend, not browser-side code.
