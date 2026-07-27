# Python

```python
import os
import requests

api_key = os.environ["NEWMONEY_DEV_API_KEY"]

response = requests.post(
    "https://devv2-dnzd.newmoney-api.workers.dev",
    json={
        "apiKey": api_key,
        "amount": 10,
        "chain": "base_sepolia",
    },
    timeout=30,
)

data = response.json()

if not response.ok:
    raise RuntimeError(
        f"New Money request failed ({response.status_code}): {data.get('error')}"
    )

print(
    {
        "orderId": data["orderId"],
        "status": data["status"],
        "paymentReference": data["payment"]["reference"],
        "expiresAt": data["payment"]["expires_at"],
    }
)
```
