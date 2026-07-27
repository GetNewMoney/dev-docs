# Documentation

New Money's DEV API lets an approved partner request a dNZD mint after depositing the matching amount of NZD.

The integration is asynchronous:

1. Your backend creates a mint request.
2. New Money returns a unique bank reference and deposit instructions.
3. The NZD deposit is received and reconciled.
4. New Money initiates the dNZD transfer to your registered Base Sepolia destination.

Creating the request alone does not prove payment and does not mint tokens.

## What is available

| Capability | DEV status |
| --- | --- |
| Create mint request | Available |
| Unique payment reference | Available |
| NZD deposit reconciliation | Available |
| Base Sepolia dNZD transfer | Available |
| Public request-status endpoint | Not yet available |
| Partner webhooks | Not yet available |
| Mainnet transfer | Not available in DEV |

## Recommended reading

1. [Getting started](getting-started.md)
2. [Authentication](authentication.md)
3. [Mint requests](concepts/mint-requests.md)
4. [Payment lifecycle](concepts/payment-lifecycle.md)
5. [Errors](resources/errors.md)
