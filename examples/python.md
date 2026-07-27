# Python

```python
import os
import requests

api_key = os.environ["NEWMONEY_DEV_API_KEY"]

flow1_response = requests.post(
    "https://devv2-dnzd.newmoney-api.workers.dev",
    json={
        "apiKey": api_key,
        "amount": 10,
        "chain": "base_sepolia",
    },
    timeout=30,
)

mint_request = flow1_response.json()

if not flow1_response.ok:
    raise RuntimeError(
        f"Flow 1 failed ({flow1_response.status_code}): "
        f"{mint_request.get('error')}"
    )

flow2_response = requests.post(
    "https://toroagroup.app.n8n.cloud/webhook/dev-payment-simulator",
    json={
        "payment_reference": mint_request["payment"]["reference"],
        "amount": mint_request["amount"],
    },
    timeout=30,
)

simulation = flow2_response.json()

if not flow2_response.ok:
    raise RuntimeError(
        f"Flow 2 failed ({flow2_response.status_code}): "
        f"{simulation.get('error')}"
    )

print(
    {
        "orderId": mint_request["orderId"],
        "requestStatus": mint_request["status"],
        "paymentReference": mint_request["payment"]["reference"],
        "transactionId": simulation["payment_event"]["transaction_id"],
        "paymentEventStatus": simulation["payment_event"]["status"],
    }
)
```

A `settled` payment event confirms Flow 2 succeeded. Mint completion remains asynchronous.
