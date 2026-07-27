# Security

## API keys

New Money DEV API keys are secret credentials. Store them in server-side environment variables or a secrets manager.

Never:

- embed an API key in browser or mobile application code
- commit an API key to Git
- paste an API key into an issue, screenshot, log, or support ticket
- share one key between unrelated environments

If a key may have been exposed, contact `tech@getnewmoney.io` and request rotation.

## Reporting vulnerabilities

Do not open a public GitHub issue for a vulnerability. Email `tech@getnewmoney.io` with the affected endpoint, a concise reproduction using synthetic data, and the potential impact.
