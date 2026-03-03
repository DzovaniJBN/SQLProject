import pool from "../db/pool.js";

export const projectContextMiddleware = async (req, res, next) => {
    const {projectId} = req.params;

    if (!projectId) {
        return res.status(400).json({error: "Project ID required"});
    }

    const result = await pool.query(
        "SELECT id FROM projects WHERE id = $1",
        [projectId]
    )

    if (result.rowCount === 0) {
        return res.status(404).json({error: "Project not found."});
    }

    req.project = result.rows[0];

    next();
}