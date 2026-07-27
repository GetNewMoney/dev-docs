# API reference

The machine-readable DEV v2 contract is available at [openapi.yaml](openapi.yaml).

## Create mint request

```text
POST https://devv2-dnzd.newmoney-api.workers.dev/
Content-Type: application/json
```

The endpoint creates a pending request and returns bank-deposit instructions. HTTP `201` does not mean minting is complete.

## Contract notes

- DEV chain: `base_sepolia`
- Request currency: NZD
- Minimum amount: `0.01`
- Amount precision: maximum two decimal places
- Authentication: issued API key in the JSON body
- Rate limiting: applies by client network and API-key identity

For copy-ready calls, see [examples](../examples/README.md).
