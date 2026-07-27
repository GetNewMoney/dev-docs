# Mint requests

A mint request records an intent to exchange an exact NZD deposit for dNZD on the partner's registered destination.

## Request fields

| Field | Type | Required | DEV behavior |
| --- | --- | --- | --- |
| `apiKey` | string | Yes | Issued DEV credential |
| `amount` | number | Yes | NZD amount, greater than or equal to `0.01`, maximum two decimal places |
| `chain` | string | Yes | `base_sepolia` |

The partner's per-transaction and daily limits may be lower than the platform maximum.

## Returned identifiers

Store:

- `orderId` as your New Money request identifier
- `payment.reference` for bank reconciliation
- `payment.expires_at` to prevent payment after the request window

Do not generate or modify the payment reference.

## Deposit requirements

Automatic reconciliation requires:

- exact payment reference
- exact amount
- incoming credit transaction
- transaction received before the request expires

No match leaves the request pending. Multiple exact matches require review and are not automatically minted.
