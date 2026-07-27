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

## 3. Call Flow 1: create a mint request

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
    "account_number": "38-9027-0176250-00",
    "reference": "MABC123XYZ",
    "expires_at": "2026-07-28T01:00:00.000Z"
  },
  "message": "Mint request created. Awaiting fiat deposit before minting."
}
```

Save `orderId`, `amount`, and `payment.reference`.

## 4. Call Flow 2: simulate the payment

Do not send a real bank payment in DEV. Call the simulator with the exact values returned by Flow 1:

```bash
curl --fail-with-body \
  -X POST "https://toroagroup.app.n8n.cloud/webhook/dev-payment-simulator" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_reference": "MABC123XYZ",
    "amount": 10
  }'
```

Example response:

```json
{
  "ok": true,
  "message": "Simulated payment event created",
  "payment_event": {
    "transaction_id": "devtx_example_123",
    "transaction_hash": "devhash_ord_example_123_MABC123XYZ",
    "source_type": "dev_simulator",
    "order_id": "ord_example_123",
    "payment_reference": "MABC123XYZ",
    "amount": 10,
    "currency": "NZD",
    "receiving_account": "38-9027-0176250-00",
    "other_account": "00-0000-0000000-00",
    "transaction_date": "2026-07-27T20:23:44.064Z",
    "status": "settled",
    "description": "DEV SIMULATED PAYMENT",
    "user_name": "Example Partner",
    "user_email": null,
    "brale_address_id": "registered_destination_id",
    "chain": "base_sepolia"
  }
}
```

## 5. Treat mint completion as asynchronous

Flow 1 returning `201` means the request was recorded. Flow 2 returning `200` means the simulated payment transaction was created and reconciliation was triggered. Neither response is a synchronous confirmation that the Brale transfer has finished.

There is no public status endpoint yet. Coordinate settlement verification with New Money support using `orderId`.
