import express from 'express';
const vipRouter = express.Router();
import { getVipItems, getVipItemsById, createVipItem, updateVipItem, deleteVipItems } from '../controllers/vipControllerAfter.js';
vipRouter.get('/', getVipItems);
vipRouter.get('/:id', getVipItemsById);
vipRouter.post('/', createVipItem);
vipRouter.put('/:id', updateVipItem);
vipRouter.delete('/:id', deleteVipItems);

export default vipRouter