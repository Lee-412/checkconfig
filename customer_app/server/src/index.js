import express from 'express';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';

const { Pool } = pg;

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối đến DB host trên Neon
const pool = new Pool({
  connectionString: 'postgresql://Linglooma_owner:npg_KZsn7Wl3LOdu@ep-snowy-fire-a831dkmt-pooler.eastus2.azure.neon.tech/Linglooma?sslmode=require',
});

const SECRET = 'your-secret-key';

// Middleware để verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/', async (req, res) => {
  res.send("Hello world");
});


app.post('/', async (req, res) => {
  res.send("Hello world");
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// CRUD Operations
app.get('/api/items', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items WHERE created_by = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/items', authenticateToken, async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO items (name, created_by) VALUES ($1, $2)', [name, req.user.id]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.listen(8081, () => {
  console.log('Server running on port 8081');
});