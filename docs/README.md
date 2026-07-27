# Documentation

New Money's DEV API lets an approved partner test the complete DNZD mint lifecycle without sending a real bank payment.

## Required two-step test

1. Your backend calls Flow 1 to create a mint request.
2. Flow 1 returns `orderId`, the expected amount, and a unique `payment.reference`.
3. Your test runner calls Flow 2 with that exact reference and amount.
4. Flow 2 creates a simulated Akahu credit transaction.
5. Reconciliation claims the transaction and initiates the dNZD transfer to the registered Base Sepolia destination.

Flow 1 alone leaves the request at `pending_payment`. A successful Flow 2 response confirms that the simulated payment event was created, not that minting has already completed.

## What is available

| Capability | DEV status |
| --- | --- |
| Create mint request | Available through Flow 1 |
| Simulate matching payment | Available through Flow 2 |
| Reconciliation | Triggered automatically after Flow 2 |
| Base Sepolia dNZD transfer | Available |
| Public request-status endpoint | Not yet available |
| Partner completion webhooks | Not yet available |
| Real Akahu bank collection | Replaced by Flow 2 in DEV |
| Mainnet transfer | Not available in DEV |

## Recommended reading

1. [Getting started](getting-started.md)
2. [Authentication](authentication.md)
3. [Mint requests](concepts/mint-requests.md)
4. [Payment lifecycle](concepts/payment-lifecycle.md)
5. [Testing](testing.md)
6. [Errors](resources/errors.md)
