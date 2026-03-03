BEGIN;

ALTER TABLE users
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE items
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE users
    FORCE ROW LEVEL SECURITY;
ALTER TABLE projects
    FORCE ROW LEVEL SECURITY;
ALTER TABLE items
    FORCE ROW LEVEL SECURITY;



DROP POLICY IF EXISTS tenant_isolation_users ON users;

CREATE POLICY tenant_isolation_users
    ON users
    FOR ALL
    USING (
    tenant_id =
    current_setting('app.current_tenant')::uuid
    )
    WITH CHECK (
    tenant_id =
    current_setting('app.current_tenant')::uuid
    );



DROP POLICY IF EXISTS tenant_isolation_projects ON projects;

CREATE POLICY tenant_isolation_projects
    ON projects
    FOR ALL
    USING (
    tenant_id =
    current_setting('app.current_tenant')::uuid
    )
    WITH CHECK (
    tenant_id =
    current_setting('app.current_tenant')::uuid
    );



DROP POLICY IF EXISTS tenant_isolation_items ON items;

CREATE POLICY tenant_isolation_items
    ON items
    FOR ALL
    USING (
    EXISTS (SELECT 1
            FROM projects p
            WHERE p.id = items.project_id
              AND p.tenant_id =
                  current_setting('app.current_tenant')::uuid)
    )
    WITH CHECK (
    EXISTS (SELECT 1
            FROM projects p
            WHERE p.id = items.project_id
              AND p.tenant_id =
                  current_setting('app.current_tenant')::uuid)
    );


COMMIT;