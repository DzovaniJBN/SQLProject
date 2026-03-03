export async function insertProject(client, tenantId, name) {
    return client.query(
        `
            INSERT INTO projects (tenant_id, name)
            VALUES ($1, $2) RETURNING id, tenant_id, name, created_at
        `,
        [tenantId, name]
    );
}

export async function getProjectsByTenant(client, tenantId, limit, offset) {
    return client.query(
        `
            SELECT id, tenant_id, name, created_at
            FROM projects
            WHERE tenant_id = $1
            ORDER BY created_at
                LIMIT $2
            OFFSET $3
        `,
        [tenantId, limit, offset]
    );
}

export async function getProjectById(client, tenantId, projectId) {
    return client.query(
        `
            SELECT id, tenant_id, name, created_at
            FROM projects
            WHERE tenant_id = $1
              AND id = $2 LIMIT 1
        `,
        [tenantId, projectId]
    );
}