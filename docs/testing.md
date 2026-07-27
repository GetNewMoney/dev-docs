# DEV testing

Use a unique request for every end-to-end test.

## Recommended test

1. Create a small Base Sepolia request.
2. Save the returned `orderId` and payment reference.
3. Use the approved DEV payment-simulation process supplied during onboarding.
4. Ask New Money to confirm the request reached `minted`.
5. Verify the expected Base Sepolia destination.

The payment simulator is not part of the public API contract. Its URL and access policy are supplied only to approved DEV testers.

## Useful negative tests

| Test | Expected result |
| --- | --- |
| Missing API key | `400` |
| Invalid API key | `401` |
| Amount is a string | `400` |
| Amount has more than two decimals | `400` |
| Unsupported chain | `400` |
| Request exceeds assigned limit | `400` |
| Too many requests | `429` |

Never use real customer details or real production bank credentials in DEV.
