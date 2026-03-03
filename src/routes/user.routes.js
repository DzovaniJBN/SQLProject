import {Router} from "express";
import {requireRole} from '../middleware/role.middleware.js';

const router = Router();
import {
    insertUserHandler,
    getUserByEmailHandler,
    getUsersListHandler,
    updateUserHandler,
    deleteUserHandler
} from '../controllers/user.controller.js';

router.post('/insert', requireRole('admin'), insertUserHandler);
router.get('/get/list', requireRole('admin'), getUsersListHandler);
router.get('/get', getUserByEmailHandler);
router.patch('/:id', requireRole('admin'), updateUserHandler);
router.delete('/:id', requireRole('admin'), deleteUserHandler);

export default router;