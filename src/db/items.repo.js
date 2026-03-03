export async function insertItem(client, projectId, title) {
    return client.query(
        `
            INSERT INTO items (project_id, title)
            VALUES ($1, $2) RETURNING id, project_id, title, status, created_at
        `,
        [projectId, title]
    )
}

export async function bulkInsertItems(client, projectId, items) {
    if (!Array.isArray(items) || items.length === 0) {
        return {rows: []};
    }

    const values = [];

    const placeholders = items.map((item, i) => {
        if (!item || typeof item !== "string" || !item.trim())
            throw new Error(`Invalid title at index ${i}`);

        const idx = i * 2;
        values.push(projectId, item);
        return `($${idx + 1}, $${idx + 2})`;
    });
    return client.query(
        `
            INSERT INTO items (project_id, title)
            VALUES ${placeholders.join(", ")} RETURNING id, project_id, title, status, created_at
        `,
        values
    )
}

export async function getItemsByProject(client, tenantId, projectId, options = {}) {
    const {status, limit, offset} = options;

    const safeLimit = Math.min(Math.max(Number(limit), 1), 100);
    const safeOffset = Math.max(Number(offset), 0);

    return client.query(
        `
            SELECT i.id, i.project_id, i.title, i.status, i.created_at
            FROM items i
                     JOIN projects p ON p.id = i.project_id
            WHERE p.tenant_id = $1
              AND p.id = $2
              AND ($3::item_status IS NULL OR i.status = $3::item_status)
            ORDER BY i.created_at
                LIMIT $4
            OFFSET $5
        `,
        [tenantId, projectId, status || null, safeLimit, safeOffset]
    );
}


export async function updateItemStatus(client, tenantId, itemId, status) {
    return client.query(
        `
            UPDATE items i
            SET status = $3 FROM projects p
            WHERE i.project_id = p.id
              AND p.tenant_id = $1
              AND i.id = $2
                RETURNING i.id
                , i.project_id
                , i.title
                , i.status
                , i.created_at
        `,
        [tenantId, itemId, status]
    )
}