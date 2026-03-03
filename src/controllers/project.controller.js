import pool from "../db/pool.js";
import * as projectService from "../services/project.service.js";

export const insertProjectHandler = async (req, res) => {
    console.log(req.context);
    const {name} = req.body;
    const tenantId = req.context.tenantId;
    console.log(req.body);

    if (!name) {
        return res.status(400).json({
            error: "Project name required"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        await client.query(
            "SELECT set_config('app.current_tenant', $1, true)",
            [tenantId]
        );
        const project = await projectService.createProject(client, tenantId, name);
        await client.query("COMMIT");

        res.status(201).json(project);
    } catch (err) {
        await client.query("ROLLBACK");

        if (err.code === "23505") {
            return res.status(409).json({error: "Project already exists"});
        }
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    } finally {
        client.release();
    }
};

export const getProjectsByTenantHandler = async (req, res) => {
    console.log(req.context);
    const tenantId = req.context.tenantId;
    console.log(tenantId);
    const {limit, offset} = req.body;

    if (!tenantId) {
        return res.status(400).send({error: "Tenant ID is required"});
    }

    const client = await pool.connect();

    try {
        const projects = await projectService.getProjectsByTenant(
            client,
            tenantId,
            limit,
            offset,
        );

        res.status(201).json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    } finally {
        client.release();
    }
};

export const getProjectByIdHandler = async (req, res) => {
    const {projectId} = req.params;
    const tenantId = req.context.tenantId;

    if (!projectId || !tenantId) {
        return res
            .status(400)
            .send({error: "Project ID and Tenant ID are required"});
    }

    const client = await pool.connect();

    try {
        const project = await projectService.getProjectById(
            client,
            tenantId,
            projectId,
        );
        res.status(201).json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    } finally {
        client.release();
    }
};
