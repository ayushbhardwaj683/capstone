# System Architecture

## Overview

The project follows a workspace-based architecture:

- `frontend` serves the builder UI, owner dashboard, and public response pages
- `backend` owns authentication, validation, persistence, analytics, audit logs, and future integrations
- `packages/shared` centralizes the schema contracts used by both apps

## Request Flow

1. Authenticated users manage forms from the frontend dashboard.
2. The frontend calls the Express API through REST endpoints.
3. The API validates payloads, applies auth and rate limiting, and persists data in MongoDB.
4. Public responders access forms through a slug or form id and submit responses through public endpoints.
5. Owners view analytics and response exports from protected endpoints.

## Core Collections

- `users`: account profile and role metadata
- `forms`: form schema, publishing, rules, and collaborators
- `responses`: individual submissions with computed metadata
- `auditlogs`: immutable activity history

## Backend Layers

- `routes`: endpoint composition
- `controllers`: request and response handling
- `services`: business logic
- `models`: MongoDB schemas
- `middleware`: auth, validation, rate limiting, error handling

## Frontend Areas

- `app/dashboard`: owner overview
- `app/forms/create`: create flow
- `app/forms/[formId]/edit`: builder experience
- `app/forms/[formId]/responses`: analytics and response management
- `app/form/[slug]`: public form rendering

## Phase 1 Feature Mapping

- Completed: multi-tenant ownership, drag-and-drop builder scaffold, advanced field schema, JWT auth
- In progress: conditional logic, analytics dashboard, public sharing links
