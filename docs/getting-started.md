# Getting started

## 1. Request DEV access

Email `tech@getnew.money` with:

- company name
- technical contact
- intended integration
- expected test volume

New Money will provide a DEV API key and register your Base Sepolia destination.

## 2. Store the API key

Store the issued key in a server-side secret:

```bash
export NEWMONEY_DEV_API_KEY="replace-with-issued-dev-key"
```

Do not expose it to browser JavaScript or commit it to source control.

## 3. Create a mint request

```bash
curl --fail-with-body \
  -X POST "https://devv2-dnzd.newmoney-api.workers.dev" \
  -H "Content-Type: application/json" \
  -d "{
    \"apiKey\": \"$NEWMONEY_DEV_API_KEY\",
    \"amount\": 10,
    \"chain\": \"base_sepolia\"
  }"
```

Example response:

```json
{
  "ok": true,
  "status": "pending_payment",
  "orderId": "ord_example_123",
  "amount": 10,
  "currency": "NZD",
  "chain": "base_sepolia",
  "brale_address_id": "registered_destination_id",
  "payment": {
    "bank_name": "Kiwibank",
    "account_name": "NewMoney NZ Limited",
    "account_number": "provided_in_response",
    "reference": "MABC123XYZ",
    "expires_at": "2026-07-28T01:00:00.000Z"
  },
  "message": "Mint request created. Awaiting fiat deposit before minting."
}
```

## 4. Pay exactly as instructed

Send the exact `amount` to the returned bank account and use `payment.reference` exactly. A different amount or reference cannot be reconciled automatically.

## 5. Treat completion as asynchronous

`201 Created` confirms the request was recorded. It does not confirm that dNZD was minted. Until a status endpoint or partner webhook is available, coordinate DEV settlement verification with New Money support.
