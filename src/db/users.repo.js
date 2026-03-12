export async function insertUser(client, email, role, passwordHash) {
    return client.query(
        `
            INSERT INTO users (tenant_id, email, role, password_hash)
            VALUES (current_setting('app.current_tenant')::uuid, $1, $2, $3)
            RETURNING id, tenant_id, email, role, created_at
        `,
        [email, role, passwordHash]
    );
}

export async function getUserByEmail(client, email) {
    return client.query(
        `
            SELECT id, tenant_id, email, role, created_at
            FROM users
            WHERE email = $1 LIMIT 1
        `,
        [email]
    );
}

export async function getUserByEmailForAuth(client, email) {
    return client.query(
        `
            SELECT id, tenant_id, email, role, password_hash
            FROM users
            WHERE email = $1 LIMIT 1
        `,
        [email]
    );
}

export async function getUsersList(client) {
    return client.query(
        `
            SELECT id, tenant_id, email, role, created_at, password_hash
            FROM users
        `
    )
}

export async function updateUser(client, userId, email, role) {
    return client.query(
        `
            UPDATE users
            SET email = $2,
                role  = $3
            WHERE id = $1 RETURNING id, tenant_id, email, role, created_at
        `,
        [userId, email, role]
    );
}

export async function deleteUser(client, userId) {
    return client.query(
        `
            DELETE
            FROM users
            WHERE id = $1 RETURNING id, tenant_id, email, role, created_at
        `,
        [userId]
    );
}
