# JavaScript

Node.js 18 or later:

```javascript
const apiKey = process.env.NEWMONEY_DEV_API_KEY;

if (!apiKey) {
  throw new Error('NEWMONEY_DEV_API_KEY is required');
}

const flow1Response = await fetch('https://devv2-dnzd.newmoney-api.workers.dev', {
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

const mintRequest = await flow1Response.json();

if (!flow1Response.ok) {
  throw new Error(`Flow 1 failed (${flow1Response.status}): ${mintRequest.error}`);
}

const flow2Response = await fetch(
  'https://toroagroup.app.n8n.cloud/webhook/dev-payment-simulator',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payment_reference: mintRequest.payment.reference,
      amount: mintRequest.amount,
    }),
  },
);

const simulation = await flow2Response.json();

if (!flow2Response.ok) {
  throw new Error(`Flow 2 failed (${flow2Response.status}): ${simulation.error}`);
}

console.log({
  orderId: mintRequest.orderId,
  requestStatus: mintRequest.status,
  paymentReference: mintRequest.payment.reference,
  transactionId: simulation.payment_event.transaction_id,
  paymentEventStatus: simulation.payment_event.status,
});
```

Use this from a trusted backend or controlled DEV test runner, not browser-side code. A `settled` payment event does not synchronously confirm mint completion.
