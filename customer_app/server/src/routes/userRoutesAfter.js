import express from 'express';
const userRouter = express.Router();
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userControllerAfter.js';

userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter