# DEV testing

Use a unique Flow 1 request for every end-to-end test. Do not send real money in DEV.

## Recommended test

1. Call Flow 1 with a small amount and `chain: base_sepolia`.
2. Confirm HTTP `201` and save `orderId`, `amount`, and `payment.reference`.
3. Call Flow 2 with the exact `payment_reference` and amount.
4. Confirm HTTP `200`, `payment_event.status: settled`, and the same `order_id`, reference, and amount.
5. Allow reconciliation to complete asynchronously.
6. Ask New Money to confirm the request reached `minted`, then verify the registered Base Sepolia destination.

Flow 2:

```text
POST https://toroagroup.app.n8n.cloud/webhook/dev-payment-simulator
```

## Useful negative tests

| Endpoint | Test | Expected result |
| --- | --- | --- |
| Flow 1 | Missing API key | `400` |
| Flow 1 | Invalid API key | `401` |
| Flow 1 | Amount is a string | `400` |
| Flow 1 | Amount has more than two decimals | `400` |
| Flow 1 | Unsupported chain | `400` |
| Flow 1 | Request exceeds assigned limit | `400` |
| Flow 1 | Too many requests | `429` |
| Flow 2 | Unknown payment reference | `404` |
| Flow 2 | Wrong amount | `400` with expected and received amounts |
| Flow 2 | Repeat an already processed reference | `409` with `request_status` |

Never use real customer details or real production bank credentials in DEV.
