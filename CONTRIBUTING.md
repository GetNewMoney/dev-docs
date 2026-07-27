# Contributing

Documentation changes should describe externally observable behavior only.

## Pull requests

1. Update the relevant guide and `reference/openapi.yaml`.
2. Add an entry to `CHANGELOG.md` for contract changes.
3. Use placeholders in every request example.
4. Run `node scripts/validate-docs.mjs`.
5. Confirm links and examples against DEV without committing response data containing customer information.

Do not add internal n8n URLs, DataTable IDs, workflow IDs, provider credentials, account tokens, or customer records.
