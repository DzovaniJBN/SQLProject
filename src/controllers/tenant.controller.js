import pool from "../db/pool.js";
import * as tenantService from "../services/tenant.service.js";

export const insertTenantHandler = async (req, res) => {
    const {name, adminEmail, adminPassword} = req.body;

    if (!name || !adminEmail) {
        return res.status(400).json({error: 'Tenant name and admin email are required'});
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const tenant = await tenantService.createTenantWithAdmin(client, name, adminEmail, adminPassword);
        await client.query("COMMIT");

        res.status(201).json(tenant);
    } catch (err) {
        await client.query("ROLLBACK");

        if (err.code === '23505') {
            return res.status(409).json({error: 'Tenant or admin already exists'});
        }
        console.error(err);
        res.status(500).json({error: "Internal server error"});

    } finally {
        client.release();
    }
}

export const deleteTenantHandler = async (req, res) => {
    const tenantId = req.context.tenantId;

    if (!tenantId) {
        return res.status(400).json({error: 'Tenant ID required'});
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const deleted = await tenantService.deleteTenant(client, tenantId);

        if (!deleted) {
            await client.query("ROLLBACK");
            return res.status(400).json({error: 'Tenant not found'});
        }

        await client.query("COMMIT");
        res.status(204).send();
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    } finally {
        client.release();
    }
}