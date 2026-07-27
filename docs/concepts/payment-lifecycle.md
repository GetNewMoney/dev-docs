# Payment lifecycle

Minting is asynchronous because the simulated payment, reconciliation, and dNZD transfer occur after Flow 1.

```text
pending_payment -> processing -> minted
       |
       +---------------------> expired
```

## Statuses

| Status | Meaning |
| --- | --- |
| `pending_payment` | Flow 1 completed and the request is waiting for Flow 2 or another matching credit |
| `processing` | A matching transaction has been claimed for reconciliation |
| `minted` | The transaction was processed and the Brale transfer was created |
| `expired` | The payment window ended before a valid match was processed |

## Integration guidance

- Persist `orderId`, amount, reference, and expiry together.
- Call Flow 2 once with the exact amount and reference from Flow 1.
- Display `pending_payment` after Flow 1.
- Treat Flow 2's `settled` payment event as payment simulation success, not mint completion.
- Do not retry by creating duplicate requests unless you intentionally want a new reference.
- Do not repeat Flow 2 after it succeeds.
- Contact support with `orderId`; never include your API key.

Public status lookup and partner webhook delivery are not part of the current DEV contract.
