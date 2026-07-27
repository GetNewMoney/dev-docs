# Errors

Errors are JSON responses. Treat the HTTP status as authoritative and the message as diagnostic text.

## Flow 1

| HTTP status | Meaning | Client action |
| --- | --- | --- |
| `400` | Invalid body, amount, chain, or assigned limit | Correct the request; do not retry unchanged |
| `401` | Invalid API key | Verify the DEV secret or request rotation |
| `403` | Partner account inactive or not permitted | Contact support |
| `429` | Rate limit or overlapping request | Wait for `Retry-After`, then retry with backoff |
| `500` | Internal processing error | Retry cautiously with backoff |
| `503` | Service configuration unavailable | Stop automatic retries and contact support if persistent |

## Flow 2

| HTTP status | Meaning | Client action |
| --- | --- | --- |
| `400` | Missing/invalid fields or amount mismatch | Use the exact amount returned by Flow 1 |
| `404` | No mint request has that payment reference | Use the exact `payment.reference` returned by Flow 1 |
| `409` | Request is no longer awaiting payment | Do not repeat Flow 2; inspect `request_status` |

Example:

```json
{
  "ok": false,
  "error": "Invalid API key"
}
```

## Retry policy

- Retry `429` according to `Retry-After`.
- Retry transient `500` responses with exponential backoff and jitter.
- Do not automatically retry `400`, `401`, `403`, `404`, or `409`.
- Do not repeat a successful Flow 2 call.
- Before retrying an uncertain request, keep the original response and timestamp so New Money can check whether an order was created.
