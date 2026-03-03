import { validate as uuidValidate } from "uuid";
import pool from "../db/pool.js";

export const tenantContextMiddleware = async (req, res, next) => {
    try {
        const tenantId = req.headers["x-tenant-id"];

        if (!tenantId)
            return res.status(400).json({ error: "Tenant ID header missing" });

        if (!uuidValidate(tenantId))
            return res.status(400).json({ error: "Invalid tenant id format" });

        const result = await pool.query(
            `SELECT id FROM tenants WHERE id = $1`,
            [tenantId]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Tenant not found" });

        req.context = {
            tenantId,
            userId: "dev-user",
            role: "admin"
        };

        next();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Tenant middleware failure" });
    }
};
