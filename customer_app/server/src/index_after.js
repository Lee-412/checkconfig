


import express from 'express';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import morgan from 'morgan';
import vipRouter from './routes/vipRoutesAfter.js';
import itemRouter from './routes/itemRoutesAfter.js';
import userRouter from './routes/userRoutesAfter.js';

const { Pool } = pg;

const app = express();

// Cấu hình CORS
app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  })
);

app.use(express.json());

// Cấu hình morgan logger
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('cookies', (req) => JSON.stringify(req.headers.cookie || 'No cookies'));
morgan.token('auth', (req) => req.headers['Authorization'] || 'No auth header');
morgan.token('user', (req) => (req.body ? JSON.stringify(req.body.username) : 'No user'));
app.use(
  morgan(':method :url :status :response-time ms - Body: :body - Cookies: :cookies - Auth: :auth - User: :user')
);

// Kết nối DB
const pool = new Pool({
  connectionString:
    'postgresql://Linglooma_owner:npg_KZsn7Wl3LOdu@ep-snowy-fire-a831dkmt-pooler.eastus2.azure.neon.tech/Linglooma?sslmode=require',
});

const SECRET = 'your-secret-key';

// Routes
app.use('/api/api/items', itemRouter);
app.use('/api/api/vipitems', vipRouter);
app.use('/api/api/users', userRouter);

app.get('/', async (req, res) => {
  res.json({ "dav": "69 chua lang" });
});

app.post('/api/abc', async (req, res) => {
  const { username, password } = req.body;
  console.log("Anh yeu vcl");
  console.log(username);
  console.log(password);
  res.send("Dit con me cay vcl");
});

app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, role]
      );
      return res.json({ message: "success", result: result.rows[0] });
    }
    return res.status(409).json({ message: 'Username already exists' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/api/login', async (req, res) => {
  const { username, password, authData} = req.body;
  console.log("User: " + username);
  
  try {
 
    res.json({token: authData});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.listen(8081, () => {
  console.log('Server running on port 8081');
});