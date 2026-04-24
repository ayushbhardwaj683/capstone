# API Endpoints

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

## Forms

- `GET /api/forms`
- `POST /api/forms`
- `GET /api/forms/:formId`
- `PATCH /api/forms/:formId`
- `POST /api/forms/:formId/publish`
- `GET /api/forms/:formId/responses`
- `GET /api/forms/:formId/analytics`

## Public

- `GET /api/public/forms/:slug`
- `POST /api/public/forms/:slug/submit`

## Data Model Coverage

- Dynamic fields support conditional logic and option-driven inputs
- Form settings support slugging, expiration, auth gating, passwords, and response editing flags
- Responses retain submission metadata for rate-limiting or abuse prevention
- Audit logs record form lifecycle and submission events
