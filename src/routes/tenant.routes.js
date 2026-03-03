import {Router} from "express";
import {insertTenantHandler, deleteTenantHandler} from '../controllers/tenant.controller.js';
import {authMiddleware} from '../middleware/auth.middleware.js';

const router = Router();

router.post('/tenants', insertTenantHandler);
router.delete('/tenants', authMiddleware, deleteTenantHandler);

export default router;