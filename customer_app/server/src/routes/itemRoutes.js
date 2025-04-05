import express from 'express';
import { authenticateToken, authorizeRoles, debugToken, sanitizeUserData } from '../middlewares/authMiddlewares.js';
import { getItems, createItem, updateItem, deleteItem, getItemsById } from '../controllers/itemController.js';
const itemRouter = express.Router();


itemRouter.get('/', authenticateToken, authorizeRoles('admin', 'user', "premium"), getItems);
itemRouter.get('/:id', authenticateToken, authorizeRoles('admin', 'user', "premium"), getItemsById);
itemRouter.post('/', authenticateToken, authorizeRoles('admin'), createItem);
itemRouter.put('/:id', authenticateToken, authorizeRoles('admin'), updateItem);
itemRouter.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteItem);

export default itemRouter;