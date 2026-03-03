import * as userRepo from '../db/users.repo.js';
import bcrypt from 'bcrypt';
import {BadRequestError} from '../errors/badRequest.error.js';

export const insertUser = async (client, tenantId, email, password) => {
    const hash = await bcrypt.hash(password, 10);

    return userRepo.insertUser(
        client,
        tenantId,
        email,
        "member",
        hash
    );
};

export const getUserByEmail = async (client, tenantId, email) => {
    const result = await userRepo.getUserByEmail(client, tenantId, email);
    return result;
}

export const getUsersList = async (client, tenantId) => {
    if (!tenantId) {
        throw new BadRequestError('Tenant ID is required');
    }

    const result = await userRepo.getUsersList(client, tenantId);
    return result;
}

export const updateUser = async (client, tenantId, userId, email, role) => {
    if (!tenantId) {
        throw new BadRequestError('Tenant ID is required');
    }
    
    if (!userId) {
        throw new BadRequestError('User ID is required');
    }

    const result = await userRepo.updateUser(client, tenantId, userId, email, role);
    return result;
}

export const deleteUser = async (client, tenantId, userId) => {
    if (!tenantId) {
        throw new BadRequestError('Tenant ID is required');
    }

    if (!userId) {
        throw new BadRequestError('User ID is required');
    }

    const result = await userRepo.deleteUser(client, tenantId, userId);
    return result;
}

