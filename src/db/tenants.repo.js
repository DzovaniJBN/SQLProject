export async function insertTenant(client, name) {
    return client.query(
        `
            INSERT INTO tenants (name)
            VALUES ($1) RETURNING id, name, created_at
        `,
        [name]
    );
}

export async function deleteTenantById(client, tenantId) {
    return client.query(
        `
            DELETE
            FROM tenants
            WHERE id = $1
        `,
        [tenantId]
    );
}