# Payment lifecycle

Minting is asynchronous because the bank deposit and dNZD transfer occur after the API request.

```text
pending_payment -> processing -> minted
       |
       +---------------------> expired
```

## Statuses

| Status | Meaning |
| --- | --- |
| `pending_payment` | Request exists and is waiting for a matching NZD credit |
| `processing` | A matching transaction has been claimed for reconciliation |
| `minted` | The transaction was processed and the Brale transfer was created |
| `expired` | The payment window ended before a valid match was processed |

## Integration guidance

- Persist `orderId`, amount, reference, and expiry together.
- Display `pending_payment` after the initial `201`.
- Do not show minting as complete based only on the request response.
- Do not retry by creating duplicate requests unless you intentionally want a new reference.
- Contact support with `orderId`; never include your API key.

Public status lookup and partner webhook delivery are not part of the current DEV contract.
