import express from 'express';
const vipRouter = express.Router();
import {getVipItems, getVipItemsById ,createVipItem, deleteVipItems, updateVipItem } from '../controllers/vipController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddlewares.js';

vipRouter.get('/', authenticateToken, authorizeRoles('premium', 'admin'), getVipItems);
vipRouter.get('/:id', authenticateToken, authorizeRoles('premium', 'admin'), getVipItemsById);
vipRouter.post('/', authenticateToken, authorizeRoles('admin'), createVipItem);
vipRouter.put('/:id', authenticateToken, authorizeRoles('admin'), updateVipItem);
vipRouter.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteVipItems);

export default vipRouter