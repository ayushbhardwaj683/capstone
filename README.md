# Form Builder SaaS

A capstone-ready scaffold for a Google Forms-like SaaS with a Next.js frontend, an Express API, and MongoDB schemas designed for dynamic forms, response analytics, and collaboration.

## Architecture

- `frontend/`: Next.js App Router UI for authentication, dashboard, builder, and public form rendering
- `backend/`: Express API with Mongoose models, services, controllers, and route modules
- `packages/shared/`: Shared TypeScript contracts for form schema, responses, and analytics
- `docs/`: Architecture and API design references

## Product Scope

This scaffold is optimized for these capstone features:

- Dynamic form builder with reorderable fields
- Conditional logic support in form schema
- Public form links with custom slug support
- Response submission and analytics-ready aggregation shape
- Team collaboration roles
- Audit logging
- Templates and exports

## Phase 1 Status

Completed:

- Multi-tenant architecture for per-user form ownership and isolation
- Drag and drop builder scaffold for manual-free form creation
- Advanced form field schema support
- JWT-based authentication flow

In progress:

- Conditional logic engine for field visibility
- Analytics dashboard with trends and charts
- Public sharing links for published forms

## Quick Start

1. Install dependencies at the root with `npm install`
2. Copy `.env.example` to `.env` and add your MongoDB Atlas URI
3. Run the frontend with `npm run dev:web`
4. Run the backend with `npm run dev:api`

You can also run the backend from `backend/`. The API checks both `backend/.env` and the project root `.env`.

## Suggested Team Split

- Backend engineer: auth, schemas, APIs, analytics, exports
- Frontend engineer: builder, renderer, dashboard, auth screens
- Platform engineer: conditional logic UX, AI features, deployment, docs
