# cURL

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

Save `orderId`, `payment.reference`, and `payment.expires_at` from the response.
