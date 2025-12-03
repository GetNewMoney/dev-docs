# cURL Examples

Command-line examples for the New Money API using cURL.

---

## Quick Reference

### Base URL

```
https://dev-dnzd.newmoney-api.workers.dev
```

### Required Headers

```
Content-Type: application/json
```

---

## Basic Requests

### Mint Tokens (Minimal)

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-api-key",
    "amount": 100
  }'
```

### Mint Tokens (Full Request)

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-api-key",
    "amount": 100,
    "chain": "sepolia"
  }'
```

---

## Response Examples

### Successful Response

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 100}'
```

**Response (200 OK):**
```json
{
  "ok": true,
  "user_name": "Your Company",
  "wallet_address": "0x6B4eCa48e033dd34C9cBab0bEbc708C2345b7BB5",
  "amount": 100,
  "remaining_balance": 4900,
  "message": "Mint operation initiated successfully"
}
```

### Invalid API Key

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "wrong-key", "amount": 100}'
```

**Response (401 Unauthorized):**
```json
{
  "ok": false,
  "error": "Invalid API key"
}
```

### Missing Amount

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key"}'
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": ["Missing required field: amount"]
}
```

### Insufficient Balance

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 50000}'
```

**Response (402 Payment Required):**
```json
{
  "ok": false,
  "error": "Insufficient balance",
  "amount": 50000,
  "balance": 5000
}
```

### Rate Limited

```bash
# After making too many requests
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 10}'
```

**Response (429 Too Many Requests):**
```json
{
  "error": "Rate limit exceeded",
  "limit": 10,
  "retryAfter": 60
}
```

---

## Using Environment Variables

### Set API Key

```bash
export NEWMONEY_API_KEY="your-api-key"
```

### Use in Request

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d "{
    \"apiKey\": \"$NEWMONEY_API_KEY\",
    \"amount\": 100,
    \"chain\": \"sepolia\"
  }"
```

---

## Useful Options

### Pretty Print Response

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 100}' | jq .
```

### Show HTTP Headers

```bash
curl -i -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 100}'
```

### Verbose Output (Debug)

```bash
curl -v -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 100}'
```

### Silent Mode (No Progress)

```bash
curl -s -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 100}'
```

### Set Timeout

```bash
curl --connect-timeout 10 --max-time 30 \
  -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 100}'
```

---

## Shell Scripts

### Simple Mint Script

```bash
#!/bin/bash
# mint.sh - Simple mint script

API_KEY="${NEWMONEY_API_KEY:-your-api-key}"
AMOUNT="${1:-100}"
CHAIN="${2:-sepolia}"

curl -s -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d "{
    \"apiKey\": \"$API_KEY\",
    \"amount\": $AMOUNT,
    \"chain\": \"$CHAIN\"
  }" | jq .
```

**Usage:**
```bash
chmod +x mint.sh
./mint.sh 100 sepolia
```

### Mint with Error Handling

```bash
#!/bin/bash
# mint-safe.sh - Mint with error handling

set -e

API_KEY="${NEWMONEY_API_KEY}"
AMOUNT="$1"
CHAIN="${2:-sepolia}"

if [ -z "$API_KEY" ]; then
  echo "Error: NEWMONEY_API_KEY not set"
  exit 1
fi

if [ -z "$AMOUNT" ]; then
  echo "Usage: $0 <amount> [chain]"
  exit 1
fi

# Make request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d "{
    \"apiKey\": \"$API_KEY\",
    \"amount\": $AMOUNT,
    \"chain\": \"$CHAIN\"
  }")

# Parse response
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

# Check status
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "Success!"
  echo "$BODY" | jq .
else
  echo "Error (HTTP $HTTP_CODE):"
  echo "$BODY" | jq .
  exit 1
fi
```

### Batch Mint Script

```bash
#!/bin/bash
# batch-mint.sh - Mint multiple amounts

API_KEY="${NEWMONEY_API_KEY}"
CHAIN="${1:-sepolia}"
AMOUNTS=(10 20 30 40 50)

for amount in "${AMOUNTS[@]}"; do
  echo "Minting $amount..."

  RESPONSE=$(curl -s -X POST https://dev-dnzd.newmoney-api.workers.dev \
    -H "Content-Type: application/json" \
    -d "{
      \"apiKey\": \"$API_KEY\",
      \"amount\": $amount,
      \"chain\": \"$CHAIN\"
    }")

  WALLET=$(echo "$RESPONSE" | jq -r '.wallet_address // "FAILED"')
  echo "  Wallet: $WALLET"

  # Rate limit protection - wait between requests
  sleep 6
done

echo "Done!"
```

---

## Test Commands

### Test Valid Request

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-api-key",
    "amount": 10,
    "chain": "sepolia"
  }'
```

### Test Invalid JSON

```bash
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d 'not valid json'
```

### Test Wrong Method

```bash
curl -X GET https://dev-dnzd.newmoney-api.workers.dev
```

### Test Amount Boundaries

```bash
# Minimum (0.01)
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 0.01}'

# Maximum (10000)
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 10000}'

# Below minimum (should fail)
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 0.001}'

# Above maximum (should fail)
curl -X POST https://dev-dnzd.newmoney-api.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your-api-key", "amount": 15000}'
```

### Test Rate Limiting

```bash
# Send 15 requests rapidly
for i in {1..15}; do
  echo "Request $i:"
  curl -s -X POST https://dev-dnzd.newmoney-api.workers.dev \
    -H "Content-Type: application/json" \
    -d '{"apiKey":"your-api-key","amount":1}' | jq -r '.ok // .error'
  echo ""
done
```

---

## Common Issues

### "Invalid JSON body"

**Wrong:**
```bash
# Single quotes inside JSON
curl -d "{'apiKey': 'test'}"
```

**Correct:**
```bash
# Double quotes for JSON
curl -d '{"apiKey": "test"}'
```

### "amount must be a number"

**Wrong:**
```bash
# Amount as string
curl -d '{"apiKey": "test", "amount": "100"}'
```

**Correct:**
```bash
# Amount as number
curl -d '{"apiKey": "test", "amount": 100}'
```

### Shell Variable Expansion

**Wrong:**
```bash
# Variables not expanded in single quotes
curl -d '{"apiKey": "$API_KEY"}'
```

**Correct:**
```bash
# Use double quotes for variable expansion
curl -d "{\"apiKey\": \"$API_KEY\"}"
```

---

## Related Documentation

- [API Reference](../docs/api-reference.md)
- [Error Reference](../docs/errors.md)
- [JavaScript Examples](javascript.md)
- [Python Examples](python.md)
