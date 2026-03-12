import pool from '../db/pool.js';
import * as userService from '../services/user.service.js';
import {withTenant} from "../db/withTenant.js";

export const insertUserHandler = async (req, res) => {
    const {email, password} = req.body;

    if (!email)
        return res.status(400).json({error: "Email is required"});

    if (!password || password.length < 8)
        return res.status(400).json({error: "Password must be at least 8 characters"});

    //email = email.toLowerCase().trim();

    try {
        const user = await withTenant(req, async (client) => {
            return userService.insertUser(
                client,
                email,
                password
            );
        });
        res.status(201).json(user.rows[0]);
    } catch (err) {
        if (err.code === "23505")
            return res.status(409).json({error: "User already exists"});

        console.error(err);
        res.status(500).json({error: "Internal server error"});

    }
};

export const getUserByEmailHandler = async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({error: "Email is required"});
    }


    try {
        const user = await withTenant(req, async (client) => {
            return userService.getUserByEmail(client, email);
        });
        return res.status(200).json(user.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getUsersListHandler = async (req, res, next) => {
    try {
        const result = await withTenant(req, async (client) => {
            return userService.getUsersList(client);
        });
        return res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
}

export const updateUserHandler = async (req, res, next) => {
    const userId = req.params.id;
    const {role, email} = req.body;


    try {
        const result = await withTenant(req, async (client) => {
            return userService.updateUser(client, userId, email, role);
        });

        if (result.rowCount === 0) {
            return res.status(404).json({error: "User not found or not in your tenant"});
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}

export const deleteUserHandler = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const result = await withTenant(req, async (client) => {
            return userService.deleteUser(client, userId);
        });

        if (result.rowCount === 0) {
            return res.status(404).json({error: "User not found or not in your tenant"});
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}