import pool from '../db/pool.js';
import * as userService from '../services/user.service.js';

export const insertUserHandler = async (req, res) => {
    var {email, password} = req.body;
    const tenantId = req.context.tenantId;

    if (!email)
        return res.status(400).json({error: "Email is required"});

    if (!password || password.length < 8)
        return res.status(400).json({error: "Password must be at least 8 characters"});

    email = email.toLowerCase().trim();

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const user = await userService.insertUser(
            client,
            tenantId,
            email,
            password
        );

        await client.query("COMMIT");

        res.status(201).json(user.rows[0]);

    } catch (err) {
        await client.query("ROLLBACK");

        if (err.code === "23505")
            return res.status(409).json({error: "User already exists"});

        console.error(err);
        res.status(500).json({error: "Internal server error"});

    } finally {
        client.release();
    }
};

export const getUserByEmailHandler = async (req, res) => {
    const {email} = req.body;
    const tenantId = req.context.tenantId;

    if (!email) {
        return res.status(400).json({error: "Email is required"});
    }

    if (!tenantId) {
        return res.status(400).json({error: "Tenant ID is required"});
    }

    const client = await pool.connect();

    try {
        const user = await userService.getUserByEmail(client, tenantId, email);
        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    } finally {
        client.release();
    }
}

export const getUsersListHandler = async (req, res, next) => {
    const tenantId = req.context.tenantId;

    const client = await pool.connect();

    try {
        const result = await userService.getUsersList(client, tenantId);
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    } finally {
        client.release();
    }
}

export const updateUserHandler = async (req, res, next) => {
    const tenantId = req.context.tenantId;
    const userId = req.params.id;
    const {role, email} = req.body;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const result = await userService.updateUser(client, tenantId, userId, email, role);
        await client.query("COMMIT");

        if (result.rowCount === 0) {
            return res.status(404).json({error: "User not found or not in your tenant"});
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        await client.query("ROLLBACK");
        next(err);
    } finally {
        client.release();
    }
}

export const deleteUserHandler = async (req, res, next) => {
    const tenantId = req.context.tenantId;
    const userId = req.params.id;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const result = await userService.deleteUser(client, tenantId, userId);
        await client.query("COMMIT");

        if (result.rowCount === 0) {
            return res.status(404).json({error: "User not found or not in your tenant"});
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        await client.query("ROLLBACK");
        next(err);
    } finally {
        client.release();
    }
}