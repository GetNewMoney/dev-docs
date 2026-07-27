# cURL

```bash
export NEWMONEY_DEV_API_KEY="replace-with-issued-dev-key"
export DNZD_TEST_AMOUNT="10"

FLOW1_RESPONSE=$(curl --fail-with-body --silent --show-error \
  -X POST "https://devv2-dnzd.newmoney-api.workers.dev" \
  -H "Content-Type: application/json" \
  -d "{
    \"apiKey\": \"$NEWMONEY_DEV_API_KEY\",
    \"amount\": $DNZD_TEST_AMOUNT,
    \"chain\": \"base_sepolia\"
  }")

echo "$FLOW1_RESPONSE" | jq .

PAYMENT_REFERENCE=$(echo "$FLOW1_RESPONSE" | jq -er '.payment.reference')
AMOUNT=$(echo "$FLOW1_RESPONSE" | jq -er '.amount')

curl --fail-with-body \
  -X POST "https://toroagroup.app.n8n.cloud/webhook/dev-payment-simulator" \
  -H "Content-Type: application/json" \
  -d "{
    \"payment_reference\": \"$PAYMENT_REFERENCE\",
    \"amount\": $AMOUNT
  }" | jq .
```

This example requires `jq`. Run it once per new Flow 1 response. Do not repeat Flow 2 for the same payment reference.
