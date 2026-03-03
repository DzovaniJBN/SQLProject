import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepo from '../db/users.repo.js';

export const login = async (client, email, password) => {
    const result = await userRepo.getUserByEmailForAuth(client, email);
    if (result.rowCount === 0) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
        {
            userId: user.id,
            tenantId: user.tenant_id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES}
    );

    return token;
}