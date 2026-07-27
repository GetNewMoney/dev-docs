# New Money Developer Documentation

Public documentation for integrating with the New Money DNZD development API.

> DEV v2 beta: the API and lifecycle may change before production. The current environment uses Base Sepolia and test credentials only.

## Developer portal

- [Documentation](https://getnewmoney.github.io/dev-docs/docs/)
- [API reference](https://getnewmoney.github.io/dev-docs/reference/)

## Start here

| Section | Purpose |
| --- | --- |
| [Documentation](docs/README.md) | Product overview and integration concepts |
| [Getting started](docs/getting-started.md) | Create your first mint request |
| [Authentication](docs/authentication.md) | Store and use a DEV API key safely |
| [Mint requests](docs/concepts/mint-requests.md) | Request fields and deposit instructions |
| [Payment lifecycle](docs/concepts/payment-lifecycle.md) | Asynchronous statuses and reconciliation |
| [API reference](reference/README.md) | Endpoint contract and OpenAPI file |
| [Examples](examples/README.md) | Copy-ready cURL, JavaScript, and Python |
| [Errors](docs/resources/errors.md) | Status codes and retry guidance |
| [Support](docs/resources/support.md) | Access, questions, and incident reporting |

## DEV endpoint

```text
https://devv2-dnzd.newmoney-api.workers.dev
```

The API accepts a mint request and returns unique bank-deposit instructions. It does **not** mint synchronously. New Money reconciles the matching NZD deposit before initiating the dNZD transfer.

## Minimal example

Keep your API key in a server-side environment variable:

```bash
export NEWMONEY_DEV_API_KEY="replace-with-issued-dev-key"

curl --fail-with-body \
  -X POST "https://devv2-dnzd.newmoney-api.workers.dev" \
  -H "Content-Type: application/json" \
  -d "{
    \"apiKey\": \"$NEWMONEY_DEV_API_KEY\",
    \"amount\": 10,
    \"chain\": \"base_sepolia\"
  }"
```

A successful response has HTTP status `201` and status `pending_payment`.

## Repository model

This public repository contains the partner contract only: guides, examples, and the OpenAPI definition. Cloudflare, n8n, DataTable, Akahu, and Brale implementation details remain in the private integration repository.

## Security

Never commit or expose an issued API key. Use it only from a trusted server-side environment. See [SECURITY.md](SECURITY.md).
