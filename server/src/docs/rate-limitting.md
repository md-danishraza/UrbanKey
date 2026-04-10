# Rate Limiting Policy

UrbanKey API implements rate limiting to ensure fair usage and prevent abuse.

## Rate Limits by Endpoint

| Endpoint Group             | Limit        | Window     |
| -------------------------- | ------------ | ---------- |
| `/api/chat/*`              | 10 requests  | 1 minute   |
| `/api/contact`             | 5 requests   | 1 hour     |
| `/api/auth/*`              | 10 requests  | 15 minutes |
| `/api/properties` (public) | 100 requests | 15 minutes |

## Rate Limit Headers

When rate limited, the API returns:

- **Status Code:** `429 Too Many Requests`
- **Response Body:**
  ```json
  {
    "error": "Too many requests, please slow down"
  }
  ```
