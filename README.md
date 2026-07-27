# New Money Developer Documentation

Public documentation for integrating with the New Money DNZD development API.

> DEV v2 beta uses Base Sepolia, test credentials, and a simulated payment endpoint. Do not send real money to test this integration.

## Developer portal

- [Documentation](https://getnewmoney.github.io/dev-docs/docs/)
- [API reference](https://getnewmoney.github.io/dev-docs/reference/)

## DEV flow

Every successful end-to-end DEV test uses both API calls in order:

1. **Create mint request** with your issued API key, amount, and chain.
2. **Simulate payment** with the exact amount and `payment.reference` returned by step 1.
3. New Money reconciles the simulated Akahu transaction and initiates the Base Sepolia dNZD transfer asynchronously.

| Step | Method and endpoint | Successful response |
| --- | --- | --- |
| Flow 1 | `POST https://devv2-dnzd.newmoney-api.workers.dev` | `201`, `status: pending_payment` |
| Flow 2 | `POST https://toroagroup.app.n8n.cloud/webhook/dev-payment-simulator` | `200`, simulated `payment_event` |

Flow 1 alone does not complete a DEV test. Flow 2 must use the exact reference and amount from Flow 1.

## Start here

| Section | Purpose |
| --- | --- |
| [Getting started](docs/getting-started.md) | Run the tested Flow 1 and Flow 2 sequence |
| [Authentication](docs/authentication.md) | Store and use a DEV API key safely |
| [Mint requests](docs/concepts/mint-requests.md) | Request and simulator fields |
| [Payment lifecycle](docs/concepts/payment-lifecycle.md) | Asynchronous reconciliation and statuses |
| [API reference](reference/README.md) | Both endpoint contracts and OpenAPI file |
| [Examples](examples/README.md) | Copy-ready cURL, JavaScript, and Python |
| [Errors](docs/resources/errors.md) | Status codes and retry guidance |
| [Support](docs/resources/support.md) | Access, questions, and incident reporting |

## Repository model

This public repository contains the partner contract only: guides, examples, and the OpenAPI definition. Internal n8n, DataTable, Akahu, and Brale configuration remains private.

## Security

Never commit or expose an issued API key. Use it only from a trusted server-side environment. See [SECURITY.md](SECURITY.md).
