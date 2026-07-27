# Errors

Errors are JSON responses. Treat the HTTP status as authoritative and the `error` string as diagnostic text.

Cloudflare gateway errors may contain only `error`. Errors returned by the n8n workflows also contain `"ok": false`. Do not depend on `ok` being present in every error response.

## Flow 1 gateway errors

These messages can be returned before Flow 1 reaches n8n.

| HTTP | `error` | Meaning and action |
| --- | --- | --- |
| `400` | `Invalid request body` | Body is not valid JSON. Correct it before retrying. |
| `400` | `Invalid request` | Gateway validation rejected a missing or invalid field. Check `apiKey`, numeric `amount`, and `chain`. |
| `403` | `Origin not allowed` | A browser supplied an unapproved `Origin`. Use a trusted backend. |
| `403` | `Access denied` | The caller did not satisfy an environment IP allowlist, when that optional policy is enabled. |
| `405` | `Method not allowed` | Use `POST`. The response also contains `allowed`. |
| `429` | `Request already in progress` | Another Flow 1 call for this API key is still inside the request-lock window. Retry later. |
| `429` | `Rate limit exceeded` | Wait for `Retry-After`. The current response includes `limit: 10` and `retryAfter: 60`. |
| `500` | `Internal server error` | Retry cautiously. The response can include `message: Failed to process request`; preserve `requestId`. |
| `5xx` | `Invalid upstream response` | The upstream service returned a non-JSON response. Retry cautiously and contact support if persistent. |
| `503` | `Service unavailable` | Stop automatic retries and contact support if persistent. |

Example rate-limit response:

```json
{
  "error": "Rate limit exceeded",
  "limit": 10,
  "retryAfter": 60
}
```

## Flow 1 validation errors

The gateway may return `Invalid request` instead of a more specific downstream message when it rejects the request first.

| HTTP | `error` | Corrective action |
| --- | --- | --- |
| `400` | `API key is required` | Supply `apiKey`. |
| `400` | `Invalid API key format` | Use the issued key unchanged. |
| `400` | `Amount is required` | Supply a numeric `amount`. |
| `400` | `Amount must be a finite number` | Send a JSON number, not a string or non-finite value. |
| `400` | `Invalid amount format` | Do not use exponential notation. |
| `400` | `NZD amounts limited to 2 decimal places (e.g., 10.99)` | Round the amount to at most two decimals. |
| `400` | `Minimum amount is 0.01 NZD` | Use at least `0.01`. |
| `400` | `Unsupported chain. Allowed: ...` | Use the chain registered for the partner; current partner DEV integrations use `base_sepolia`. |
| `400` | `Invalid chain. User is registered for ... only` | Use the chain assigned during onboarding. |
| `400` | `Amount exceeds transaction limit of ... NZD` | Lower the amount to the assigned transaction limit. |
| `400` | `Daily limit exceeded. User can mint ... NZD more today` | Lower the amount or wait for the limit window to reset. |
| `400` | `User is missing Brale destination configuration` | Contact support; partner configuration is incomplete. |
| `401` | `Invalid API key` | Verify the DEV key or request rotation. |
| `403` | `User account is not active` | Contact support. |

## Flow 2

| HTTP | `error` | Corrective action |
| --- | --- | --- |
| `400` | `payment_reference is required` | Supply Flow 1's exact `payment.reference`. |
| `400` | `amount must be a finite number` | Supply Flow 1's numeric `amount`. |
| `400` | `amount must be greater than 0` | Use the positive amount returned by Flow 1. |
| `400` | `Payment amount does not match mint request amount` | Use the exact Flow 1 amount. The response includes `expected_amount` and `received_amount`. |
| `404` | `No mint request found for that payment_reference` | Use Flow 1's exact reference. |
| `409` | `Mint request is not awaiting payment` | Do not repeat Flow 2. Inspect `request_status`, such as `processing`, `minted`, or `expired`. |

Example amount-mismatch response:

```json
{
  "ok": false,
  "error": "Payment amount does not match mint request amount",
  "expected_amount": 5,
  "received_amount": 6
}
```

Example repeated-payment response:

```json
{
  "ok": false,
  "error": "Mint request is not awaiting payment",
  "request_status": "minted"
}
```

## Retry policy

- Retry `429` according to `Retry-After`.
- Retry transient `500` responses with exponential backoff and jitter.
- Do not automatically retry `400`, `401`, `403`, `404`, or `409`.
- Do not repeat a successful Flow 2 call.
- Before retrying an uncertain request, keep the original response and timestamp so New Money can check whether an order was created.
