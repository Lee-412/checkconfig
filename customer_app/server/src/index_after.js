import express from 'express';
import vipRouter from './routes/vipRoutesAfter.js';
import itemRouter from './routes/itemRoutesAfter.js';
import userRouter from './routes/userRoutesAfter.js';
const app = express();
app.use(express.json());
app.use('/api/api/items', itemRouter);
app.use('/api/api/vipitems', vipRouter);
app.use('/api/api/users', userRouter);


app.listen(8081, () => {
  console.log('Server running on port 8081');
});