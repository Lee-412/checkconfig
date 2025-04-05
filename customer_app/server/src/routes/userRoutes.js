import express from 'express';
const userRouter = express.Router();
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddlewares.js';


userRouter.get('/', authenticateToken, authorizeRoles('admin'), getUsers);
userRouter.post('/', authenticateToken, authorizeRoles('admin'), createUser);
userRouter.put('/:id', authenticateToken, authorizeRoles('admin'), updateUser);
userRouter.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

export default userRouter