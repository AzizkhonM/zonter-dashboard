-- This is an empty migration.

CREATE UNIQUE INDEX "OrganizationRequest_one_pending_per_user"
ON "OrganizationRequest" ("userId")
WHERE "status" = 'PENDING';
