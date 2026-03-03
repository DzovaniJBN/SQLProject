BEGIN;

CREATE INDEX idx_users_tenant_email
ON users (tenant_id, email);

CREATE INDEX idx_projects_tenant_id
ON projects (tenant_id, id);

CREATE INDEX idx_items_project_created_at
ON items (project_id, created_at DESC);

COMMIT;