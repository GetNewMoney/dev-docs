# API reference

The machine-readable DEV v2 contract is available at [openapi.yaml](openapi.yaml).

The hosted interactive reference is available at
[`/reference/`](https://getnewmoney.github.io/dev-docs/reference/).

## Flow 1: create mint request

```text
POST https://devv2-dnzd.newmoney-api.workers.dev/
Content-Type: application/json
```

The endpoint creates a pending request and returns the exact reference and amount required by Flow 2. HTTP `201` does not mean minting is complete.

## Flow 2: simulate payment

```text
POST https://toroagroup.app.n8n.cloud/webhook/dev-payment-simulator
Content-Type: application/json
```

The DEV simulator creates the Akahu-style credit transaction used by reconciliation. Submit `payment_reference` and `amount` from Flow 1 exactly. HTTP `200` means the payment event was created; the dNZD transfer still completes asynchronously.

## Contract notes

- DEV chain: `base_sepolia`
- Request currency: NZD
- Minimum amount: `0.01`
- Amount precision: maximum two decimal places
- Flow 1 authentication: issued API key in the JSON body
- Flow 2 authentication: no API key field; use only the Flow 1 reference and amount
- Flow 1 rate limiting: applies by client network and API-key identity

For copy-ready calls, see [examples](../examples/README.md).
