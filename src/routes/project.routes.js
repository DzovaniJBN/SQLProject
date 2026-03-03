import {Router} from "express";
import {
    insertProjectHandler,
    getProjectsByTenantHandler,
    getProjectByIdHandler
} from "../controllers/project.controller.js";

const router = Router();

router.post('/', insertProjectHandler);
router.get('/', getProjectsByTenantHandler);
router.get('/:projectId', getProjectByIdHandler);

export default router;