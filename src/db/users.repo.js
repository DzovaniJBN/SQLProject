export async function insertUser(client, tenantId, email, role, passwordHash) {
    return client.query(
        `
            INSERT INTO users (tenant_id, email, role, password_hash)
            VALUES ($1, $2, $3, $4) RETURNING id, tenant_id, email, role, created_at
        `,
        [tenantId, email, role, passwordHash]
    );
}

export async function getUserByEmail(client, tenantId, email) {
    return client.query(
        `
            SELECT id, tenant_id, email, role, created_at
            FROM users
            WHERE tenant_id = $1
              AND email = $2 LIMIT 1
        `,
        [tenantId, email]
    );
}

export async function getUserByEmailForAuth(client, email) {
    return client.query(
        `
        SELECT id, tenant_id, email, role, password_hash
        FROM users
        WHERE email = $1
        LIMIT 1
        `,
        [email]
    );
}

export async function getUsersList(client, tenantId) {
    return client.query(
        `
        SELECT id, tenant_id, email, role, created_at, password_hash
        FROM users
        WHERE tenant_id = $1
        `,
        [tenantId]
    )
}

export async function updateUser(client, tenantId, userId, email, role) {
    return client.query(
        `
            UPDATE users
            SET email = $3,
                role  = $4
            WHERE id = $2
              AND tenant_id = $1 RETURNING id, tenant_id, email, role, created_at
        `,
        [tenantId, userId, email, role]
    );
}

export async function deleteUser(client, tenantId, userId) {
    return client.query(
        `
            DELETE
            FROM users
            WHERE id = $2
              AND tenant_id = $1 RETURNING id, tenant_id, email, role, created_at
        `,
        [tenantId, userId]
    );
}
