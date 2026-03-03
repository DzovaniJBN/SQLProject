import pool from '../db/pool.js';
import * as authService from '../services/auth.service.js';

export const loginHandler = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required0'});
    }

    const client = await pool.connect();

    try {
        const result = await authService.login(client, email, password);
        res.json(result);
    } catch (err) {
        if (err.message === "INVALID_CREDENTIALS")
            return res.status(401).json({error: "Invalid credentials"});

        console.error(err);
        res.status(500).json({error: "Login failed"});
    } finally {
        client.release();
    }
}