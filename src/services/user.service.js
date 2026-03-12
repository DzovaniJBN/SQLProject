import * as userRepo from '../db/users.repo.js';
import bcrypt from 'bcrypt';
import {BadRequestError} from '../errors/badRequest.error.js';

export const insertUser = async (client, email, password) => {
    const hash = await bcrypt.hash(password, 10);

    return userRepo.insertUser(
        client,
        email,
        "member",
        hash
    );
};

export const getUserByEmail = async (client, email) => {
    const result = await userRepo.getUserByEmail(client, email);
    return result;
}

export const getUsersList = async (client) => {
    const result = await userRepo.getUsersList(client);
    return result;
}

export const updateUser = async (client, userId, email, role) => {
    if (!userId) {
        throw new BadRequestError('User ID is required');
    }

    const result = await userRepo.updateUser(client, userId, email, role);
    return result;
}

export const deleteUser = async (client, userId) => {
    if (!userId) {
        throw new BadRequestError('User ID is required');
    }

    const result = await userRepo.deleteUser(client, userId);
    return result;
}

