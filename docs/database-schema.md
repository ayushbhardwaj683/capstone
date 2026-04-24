# MongoDB Schema Design

## User

- `name`: display name
- `email`: unique login identifier
- `passwordHash`: bcrypt-hashed password
- `role`: platform role such as `admin` or `user`

## Form

- `title`, `description`
- `ownerId`: form owner reference
- `fields[]`: dynamic field definitions
- `collaborators[]`: owner, editor, viewer access control
- `settings.customSlug`: public URL slug
- `settings.expiresAt`: optional form expiration date
- `settings.responseLimit`: optional max response cap
- `settings.requireAuth`: restrict submissions to signed-in users
- `settings.passwordProtected`: mark a form as password-gated
- `settings.accessPasswordHash`: hashed access password
- `settings.allowResponseEditing`: enable edit-after-submit flows
- `status`: draft, published, archived
- `version`: increment for schema changes

## Response

- `formId`: parent form reference
- `submittedBy`: optional authenticated submitter reference
- `answers[]`: dynamic answer payload per field
- `ipAddress`, `userAgent`: abuse-monitoring metadata
- `submittedAt`: submission timestamp

## AuditLog

- `actorId`: user responsible for an action
- `action`: domain event name such as `form.created`
- `entityType`: form, response, user, etc.
- `entityId`: related entity id
- `metadata`: extra structured context
