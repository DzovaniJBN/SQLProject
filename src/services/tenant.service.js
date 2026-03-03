import * as tenantRepo from '../db/tenants.repo.js';
import * as userRepo from '../db/users.repo.js';
import bcrypt from 'bcrypt';

export const createTenantWithAdmin = async (client, name, adminEmail, adminPassword) => {
    const tenantResult = await tenantRepo.insertTenant(client, name);
    const tenant = tenantResult.rows[0];

    const hash = await bcrypt.hash(adminPassword, 10);

    await userRepo.insertUser(client, tenant.id, adminEmail, 'admin', hash);

    return {
        id: tenant.id,
        name: tenant.name,
        createdAt: tenant.created_at
    }
}

export const deleteTenant = async (client, tenantId) => {
    const result = await tenantRepo.deleteTenantById(client, tenantId);

    return result.rowCount > 0;
}