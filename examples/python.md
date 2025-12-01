# Python Examples

Complete Python examples for the New Money API.

---

## Quick Start

### Basic Mint Request

```python
import requests

def mint_tokens(api_key: str, amount: float, chain: str = 'sepolia') -> dict:
    """
    Mint dNZD1 tokens via the New Money API.

    Args:
        api_key: Your API authentication key
        amount: Amount in USD to mint (0.01 - 10,000)
        chain: Target blockchain (default: 'sepolia')

    Returns:
        API response as dictionary

    Raises:
        Exception: If mint operation fails
    """
    url = 'https://api.getnewmoney.io/mint'

    payload = {
        'apiKey': api_key,
        'amount': amount,
        'chain': chain
    }

    response = requests.post(url, json=payload)
    data = response.json()

    if response.status_code == 200 and data.get('ok'):
        print(f"Mint successful!")
        print(f"Order ID: {data.get('orderId')}")
        print(f"Remaining balance: ${data.get('remaining_balance'):.2f}")
        return data
    else:
        error = data.get('error') or data.get('details', ['Unknown error'])
        print(f"Mint failed: {error}")
        raise Exception(error)


# Usage
if __name__ == '__main__':
    result = mint_tokens('your-api-key', 100, 'sepolia')
    print(f"Success: {result}")
```

---

## Production-Ready Client

### Full Client Class

```python
import requests
import time
import os
from typing import Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum


class Chain(Enum):
    SEPOLIA = 'sepolia'
    ETHEREUM = 'ethereum'
    POLYGON = 'polygon'
    BASE = 'base'
    AMOY = 'amoy'


@dataclass
class MintResponse:
    ok: bool
    order_id: Optional[str] = None
    status: Optional[str] = None
    user_name: Optional[str] = None
    wallet_address: Optional[str] = None
    amount: Optional[float] = None
    remaining_balance: Optional[float] = None
    message: Optional[str] = None
    error: Optional[str] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'MintResponse':
        return cls(
            ok=data.get('ok', False),
            order_id=data.get('orderId'),
            status=data.get('status'),
            user_name=data.get('user_name'),
            wallet_address=data.get('wallet_address'),
            amount=data.get('amount'),
            remaining_balance=data.get('remaining_balance'),
            message=data.get('message'),
            error=data.get('error')
        )


class NewMoneyError(Exception):
    """Base exception for New Money API errors."""

    def __init__(self, message: str, status_code: int = None, data: dict = None):
        super().__init__(message)
        self.status_code = status_code
        self.data = data or {}


class AuthenticationError(NewMoneyError):
    """Raised when API key is invalid."""
    pass


class InsufficientBalanceError(NewMoneyError):
    """Raised when account balance is too low."""
    pass


class RateLimitError(NewMoneyError):
    """Raised when rate limit is exceeded."""

    def __init__(self, message: str, retry_after: int = 60, **kwargs):
        super().__init__(message, **kwargs)
        self.retry_after = retry_after


class ValidationError(NewMoneyError):
    """Raised when request validation fails."""
    pass


class NewMoneyClient:
    """
    Production-ready client for the New Money API.

    Example:
        client = NewMoneyClient('your-api-key')
        result = client.mint(100, Chain.SEPOLIA)
        print(f"Minted {result.amount} to {result.wallet_address}")
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = 'https://api.getnewmoney.io',
        timeout: int = 30,
        max_retries: int = 3
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        self.max_retries = max_retries
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'NewMoney-Python/1.0'
        })

    def mint(
        self,
        amount: float,
        chain: Chain = Chain.SEPOLIA
    ) -> MintResponse:
        """
        Create a mint order for dNZD1 tokens.

        Args:
            amount: Amount in USD to mint (0.01 - 10,000)
            chain: Target blockchain network

        Returns:
            MintResponse with order details

        Raises:
            AuthenticationError: Invalid API key
            InsufficientBalanceError: Balance too low
            RateLimitError: Too many requests
            ValidationError: Invalid parameters
            NewMoneyError: Other API errors
        """
        payload = {
            'apiKey': self.api_key,
            'amount': amount,
            'chain': chain.value if isinstance(chain, Chain) else chain
        }

        return self._request('/mint', payload)

    def _request(
        self,
        endpoint: str,
        payload: dict,
        retries: int = 0
    ) -> MintResponse:
        """Make an API request with retry logic."""
        url = f"{self.base_url}{endpoint}"

        try:
            response = self.session.post(
                url,
                json=payload,
                timeout=self.timeout
            )
            data = response.json()

            # Handle rate limiting with retry
            if response.status_code == 429:
                if retries < self.max_retries:
                    retry_after = data.get('retryAfter', 2 ** retries)
                    print(f"Rate limited. Retrying in {retry_after}s...")
                    time.sleep(retry_after)
                    return self._request(endpoint, payload, retries + 1)
                raise RateLimitError(
                    "Rate limit exceeded",
                    retry_after=data.get('retryAfter', 60),
                    status_code=429,
                    data=data
                )

            # Handle server errors with retry
            if response.status_code >= 500:
                if retries < self.max_retries:
                    wait_time = 2 ** retries
                    print(f"Server error. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    return self._request(endpoint, payload, retries + 1)
                raise NewMoneyError(
                    "Server error",
                    status_code=response.status_code,
                    data=data
                )

            # Handle specific error types
            if response.status_code == 401:
                raise AuthenticationError(
                    "Invalid API key",
                    status_code=401,
                    data=data
                )

            if response.status_code == 402:
                raise InsufficientBalanceError(
                    f"Insufficient balance. Have: ${data.get('balance', 0):.2f}",
                    status_code=402,
                    data=data
                )

            if response.status_code == 400:
                details = data.get('details', [data.get('error', 'Validation failed')])
                raise ValidationError(
                    f"Validation error: {', '.join(details) if isinstance(details, list) else details}",
                    status_code=400,
                    data=data
                )

            if not response.ok:
                raise NewMoneyError(
                    data.get('error', 'Request failed'),
                    status_code=response.status_code,
                    data=data
                )

            # Check business logic success
            if not data.get('ok'):
                raise NewMoneyError(
                    data.get('error', 'Operation failed'),
                    status_code=response.status_code,
                    data=data
                )

            return MintResponse.from_dict(data)

        except requests.exceptions.Timeout:
            raise NewMoneyError(f"Request timed out after {self.timeout}s")
        except requests.exceptions.RequestException as e:
            raise NewMoneyError(f"Network error: {str(e)}")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.session.close()


# Usage example
if __name__ == '__main__':
    # Use environment variable for API key
    api_key = os.environ.get('NEWMONEY_API_KEY', 'your-api-key')

    with NewMoneyClient(api_key) as client:
        try:
            result = client.mint(100, Chain.SEPOLIA)
            print(f"Mint successful!")
            print(f"Order ID: {result.order_id}")
            print(f"Status: {result.status}")
            print(f"Wallet: {result.wallet_address}")
            print(f"Amount: ${result.amount:.2f}")
            print(f"Remaining: ${result.remaining_balance:.2f}")

        except AuthenticationError:
            print("Invalid API key. Please check your credentials.")

        except InsufficientBalanceError as e:
            print(f"Balance too low: {e}")
            print("Contact will@toroa.xyz to top up.")

        except RateLimitError as e:
            print(f"Rate limited. Retry in {e.retry_after} seconds.")

        except ValidationError as e:
            print(f"Invalid request: {e}")

        except NewMoneyError as e:
            print(f"API error: {e}")
```

---

## Flask Integration

### Complete Flask Application

```python
from flask import Flask, request, jsonify
import os
from functools import wraps

app = Flask(__name__)

# Configuration
NEWMONEY_API_KEY = os.environ.get('NEWMONEY_API_KEY')

# Initialize client
client = NewMoneyClient(NEWMONEY_API_KEY)


def require_auth(f):
    """Simple authentication decorator for your endpoints."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization')
        if not auth or auth != f"Bearer {os.environ.get('APP_SECRET')}":
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated


@app.route('/api/mint', methods=['POST'])
@require_auth
def mint_endpoint():
    """
    Mint tokens endpoint.

    Request body:
        {
            "amount": 100,
            "chain": "sepolia"  // optional
        }
    """
    data = request.get_json()

    # Validate input
    amount = data.get('amount')
    if not amount or not isinstance(amount, (int, float)):
        return jsonify({'error': 'Invalid amount'}), 400

    if amount <= 0 or amount > 10000:
        return jsonify({'error': 'Amount must be between 0.01 and 10000'}), 400

    chain = data.get('chain', 'sepolia')

    try:
        result = client.mint(amount, chain)

        return jsonify({
            'success': True,
            'orderId': result.order_id,
            'status': result.status,
            'amount': result.amount,
            'walletAddress': result.wallet_address
        })

    except AuthenticationError:
        app.logger.error("API key authentication failed")
        return jsonify({'error': 'Service configuration error'}), 500

    except InsufficientBalanceError as e:
        return jsonify({
            'error': 'Insufficient service balance',
            'details': str(e)
        }), 402

    except RateLimitError as e:
        return jsonify({
            'error': 'Rate limit exceeded',
            'retryAfter': e.retry_after
        }), 429

    except ValidationError as e:
        return jsonify({
            'error': 'Validation failed',
            'details': str(e)
        }), 400

    except NewMoneyError as e:
        app.logger.error(f"New Money API error: {e}")
        return jsonify({'error': 'Mint operation failed'}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
```

---

## Django Integration

### Django View

```python
# views.py
import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings


@method_decorator(csrf_exempt, name='dispatch')
class MintView(View):
    """Handle mint requests."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.client = NewMoneyClient(settings.NEWMONEY_API_KEY)

    def post(self, request):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        amount = data.get('amount')
        if not isinstance(amount, (int, float)) or amount <= 0:
            return JsonResponse({'error': 'Invalid amount'}, status=400)

        chain = data.get('chain', 'sepolia')

        try:
            result = self.client.mint(amount, chain)

            return JsonResponse({
                'success': True,
                'orderId': result.order_id,
                'status': result.status,
                'amount': result.amount
            })

        except InsufficientBalanceError:
            return JsonResponse({'error': 'Insufficient balance'}, status=402)

        except RateLimitError as e:
            return JsonResponse(
                {'error': 'Rate limited', 'retryAfter': e.retry_after},
                status=429
            )

        except NewMoneyError as e:
            return JsonResponse({'error': str(e)}, status=500)


# urls.py
from django.urls import path
from .views import MintView

urlpatterns = [
    path('api/mint/', MintView.as_view(), name='mint'),
]


# settings.py
NEWMONEY_API_KEY = os.environ.get('NEWMONEY_API_KEY')
```

---

## Async Example

### Using aiohttp

```python
import aiohttp
import asyncio
from typing import Optional


class AsyncNewMoneyClient:
    """Async client for the New Money API."""

    def __init__(
        self,
        api_key: str,
        base_url: str = 'https://api.getnewmoney.io'
    ):
        self.api_key = api_key
        self.base_url = base_url
        self._session: Optional[aiohttp.ClientSession] = None

    async def _get_session(self) -> aiohttp.ClientSession:
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession(
                headers={'Content-Type': 'application/json'}
            )
        return self._session

    async def mint(self, amount: float, chain: str = 'sepolia') -> dict:
        """Async mint operation."""
        session = await self._get_session()

        payload = {
            'apiKey': self.api_key,
            'amount': amount,
            'chain': chain
        }

        async with session.post(
            f"{self.base_url}/mint",
            json=payload
        ) as response:
            data = await response.json()

            if response.status != 200 or not data.get('ok'):
                raise NewMoneyError(
                    data.get('error', 'Mint failed'),
                    status_code=response.status,
                    data=data
                )

            return data

    async def close(self):
        if self._session and not self._session.closed:
            await self._session.close()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()


# Usage
async def main():
    async with AsyncNewMoneyClient('your-api-key') as client:
        # Single request
        result = await client.mint(100, 'sepolia')
        print(f"Order ID: {result['orderId']}")

        # Multiple concurrent requests
        tasks = [
            client.mint(10, 'sepolia'),
            client.mint(20, 'sepolia'),
            client.mint(30, 'sepolia')
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for i, result in enumerate(results):
            if isinstance(result, Exception):
                print(f"Request {i+1} failed: {result}")
            else:
                print(f"Request {i+1} success: {result['orderId']}")


if __name__ == '__main__':
    asyncio.run(main())
```

---

## Testing

### Pytest Example

```python
import pytest
from unittest.mock import patch, MagicMock


class TestNewMoneyClient:
    """Test suite for NewMoneyClient."""

    @pytest.fixture
    def client(self):
        return NewMoneyClient('test-api-key')

    @pytest.fixture
    def mock_response(self):
        """Create a mock response."""
        mock = MagicMock()
        mock.status_code = 200
        mock.json.return_value = {
            'ok': True,
            'orderId': 'test-order-123',
            'status': 'pending',
            'amount': 100,
            'remaining_balance': 4900
        }
        return mock

    def test_mint_success(self, client, mock_response):
        with patch.object(client.session, 'post', return_value=mock_response):
            result = client.mint(100, Chain.SEPOLIA)

            assert result.ok is True
            assert result.order_id == 'test-order-123'
            assert result.amount == 100

    def test_mint_auth_error(self, client):
        mock = MagicMock()
        mock.status_code = 401
        mock.json.return_value = {'ok': False, 'error': 'Invalid API key'}

        with patch.object(client.session, 'post', return_value=mock):
            with pytest.raises(AuthenticationError):
                client.mint(100)

    def test_mint_insufficient_balance(self, client):
        mock = MagicMock()
        mock.status_code = 402
        mock.json.return_value = {
            'ok': False,
            'error': 'Insufficient balance',
            'balance': 50
        }

        with patch.object(client.session, 'post', return_value=mock):
            with pytest.raises(InsufficientBalanceError):
                client.mint(100)

    def test_mint_rate_limit(self, client):
        mock = MagicMock()
        mock.status_code = 429
        mock.json.return_value = {
            'error': 'Rate limit exceeded',
            'retryAfter': 60
        }

        with patch.object(client.session, 'post', return_value=mock):
            with pytest.raises(RateLimitError) as exc_info:
                client.mint(100)
            assert exc_info.value.retry_after == 60


# Run with: pytest test_client.py -v
```

---

## Environment Setup

### requirements.txt

```
requests>=2.28.0
aiohttp>=3.8.0  # For async client
python-dotenv>=1.0.0
```

### .env file

```
NEWMONEY_API_KEY=your-api-key-here
NEWMONEY_BASE_URL=https://api.getnewmoney.io
```

### Loading environment

```python
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('NEWMONEY_API_KEY')
client = NewMoneyClient(api_key)
```

---

## Related Documentation

- [API Reference](../docs/api-reference.md)
- [Error Reference](../docs/errors.md)
- [JavaScript Examples](javascript.md)
