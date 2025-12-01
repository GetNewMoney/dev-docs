# Changelog

All notable changes to the New Money API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Coming Soon
- Real-time bank integration for fiat deposit verification
- Webhook notifications for transaction status updates
- Additional blockchain network support (Ethereum mainnet, Polygon, Base)
- Official JavaScript and Python SDKs
- Dashboard for account management

---

## [0.1.0-beta] - 2025-12-01

### Added
- Initial beta release of the New Money Minting API
- Core minting endpoint (`POST /mint`)
- API key authentication with SHA256 hashing
- Prepaid balance system for transaction management
- Rate limiting (10 requests per minute per IP)
- Request validation and input sanitization
- Support for Sepolia testnet
- Comprehensive error responses with detailed messages
- Developer documentation and code examples

### Security
- DDoS protection via edge network
- Request validation (type checking, format validation)
- Balance enforcement (prepaid system)
- Transaction limits (per-transaction and daily)
- Chain validation (whitelist approach)
- API key format validation

### Networks
- Sepolia (Ethereum testnet) - **Available**

### Tokens
- dNZD1 (NZD-backed stablecoin) - **Available**

---

## Versioning Policy

### Semantic Versioning

We use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes that require code updates
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Beta Period

During the beta period (0.x.x versions):

- API may have breaking changes without major version bump
- 7-day notice will be provided for significant changes
- All registered users will be notified via email

### Deprecation Policy

When we deprecate features:

1. **Announcement**: Posted in changelog and documentation
2. **Notice Period**: Minimum 30 days before removal
3. **Migration Guide**: Provided for all breaking changes
4. **Support**: Available via [will@toroa.xyz](mailto:will@toroa.xyz)

---

## Migration Guides

*No migrations required yet. This section will be updated when breaking changes are introduced.*

---

## Feedback

We appreciate your feedback during the beta period:

- **Feature Requests**: [GitHub Issues](https://github.com/GetNewMoney/dev-docs/issues)
- **Bug Reports**: [GitHub Issues](https://github.com/GetNewMoney/dev-docs/issues)
- **General Feedback**: [will@toroa.xyz](mailto:will@toroa.xyz)

---

[Unreleased]: https://github.com/GetNewMoney/dev-docs/compare/v0.1.0-beta...HEAD
[0.1.0-beta]: https://github.com/GetNewMoney/dev-docs/releases/tag/v0.1.0-beta
