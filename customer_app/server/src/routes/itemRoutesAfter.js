import express from 'express';
import { getItems, getItemsById, createItem, updateItem, deleteItem } from '../controllers/itemControllerAfter.js';
const itemRouter = express.Router();


itemRouter.get('/', getItems);
itemRouter.get('/:id', getItemsById);
itemRouter.post('/', createItem);
itemRouter.put('/:id', updateItem);
itemRouter.delete('/:id', deleteItem);

export default itemRouter;