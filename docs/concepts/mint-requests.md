# Mint requests

A mint request records the exact amount and registered destination for a future dNZD transfer.

## Flow 1 fields

| Field | Type | Required | DEV behavior |
| --- | --- | --- | --- |
| `apiKey` | string | Yes | Issued DEV credential |
| `amount` | number | Yes | NZD amount, at least `0.01`, maximum two decimal places |
| `chain` | string | No | Defaults to `base_sepolia`; use it explicitly in partner integrations |

The partner's per-transaction and daily limits may be lower than the platform maximum.

## Values to retain

Flow 1 returns:

- `orderId`, the New Money request identifier
- `amount`, the exact value Flow 2 must submit
- `payment.reference`, the exact value Flow 2 must submit as `payment_reference`
- `payment.expires_at`, the request payment window

Do not generate, alter, normalize, or reuse a payment reference.

## Flow 2 fields

| Field | Type | Required | DEV behavior |
| --- | --- | --- | --- |
| `payment_reference` | string | Yes | Exact `payment.reference` from Flow 1 |
| `amount` | number | Yes | Exact numeric amount from Flow 1 |
| `other_account` | string | No | Defaults to `00-0000-0000000-00` |
| `description` | string | No | Defaults to `DEV SIMULATED PAYMENT` |

Flow 2 rejects an unknown reference, a different amount, or a request that is no longer `pending_payment`.

## Reconciliation requirements

The scheduler matches:

- exact payment reference
- exact amount
- a credit transaction
- a unique transaction ID

No match leaves the request pending. Multiple exact matches are skipped rather than minted automatically.
