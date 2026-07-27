# Authentication

Each approved DEV partner receives an API key. The current DEV v2 request contract sends it in the JSON `apiKey` field.

```json
{
  "apiKey": "your-issued-dev-key",
  "amount": 10,
  "chain": "base_sepolia"
}
```

## Server-side use only

Call the New Money API from your backend. Do not call it directly from a browser or mobile application because that would expose your API key to users and client-side tooling.

Recommended:

```javascript
const apiKey = process.env.NEWMONEY_DEV_API_KEY;
```

Not recommended:

```javascript
const apiKey = "hard-coded-key";
```

## Key lifecycle

- Use separate DEV and production keys.
- Do not reuse one partner's key for another partner.
- Rotate a key whenever exposure is suspected.
- Never log the complete request body when it includes `apiKey`.

The service stores a one-way SHA-256 hash for lookup; the plaintext key should remain only with the partner and approved secret-management systems.
