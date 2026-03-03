import {Router} from "express";
import {projectContextMiddleware} from "../middleware/projectContext.js";
import {tenantContextMiddleware} from '../middleware/tenantContext.js';
import {
    insertItemHandler,
    bulkInsertItemsHandler,
    getItemsByProjectHandler,
    updateItemStatusHandler
} from "../controllers/item.controller.js"

const router = Router();

router.post('/projects/:projectId/items', insertItemHandler);
router.post('/projects/:projectId/items/bulk', bulkInsertItemsHandler);

router.get('/projects/:projectId/items', getItemsByProjectHandler);

router.patch('/items/:itemId/status', updateItemStatusHandler);

export default router;