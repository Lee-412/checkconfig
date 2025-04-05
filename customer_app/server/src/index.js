// import express from 'express';
// import jwt from 'jsonwebtoken';
// import pg from 'pg';
// import cors from 'cors';
// import bcrypt from 'bcrypt';

// const { Pool } = pg;

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Kết nối đến DB host trên Neon
// const pool = new Pool({
//   connectionString: 'postgresql://Linglooma_owner:npg_KZsn7Wl3LOdu@ep-snowy-fire-a831dkmt-pooler.eastus2.azure.neon.tech/Linglooma?sslmode=require',
// });

// const SECRET = 'your-secret-key';

// // Middleware để verify token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// app.get('/', async (req, res) => {
//   res.send("Hello world");
// });


// app.post('/', async (req, res) => {
//   res.send("Hello world");
// });

// // Login
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//     const user = result.rows[0];
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // CRUD Operations
// app.get('/api/items', authenticateToken, async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM items WHERE created_by = $1', [req.user.id]);
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// app.post('/api/items', authenticateToken, async (req, res) => {
//   const { name } = req.body;
//   try {
//     await pool.query('INSERT INTO items (name, created_by) VALUES ($1, $2)', [name, req.user.id]);
//     res.sendStatus(201);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// app.listen(8081, () => {
//   console.log('Server running on port 8081');
// });


import express from 'express';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import morgan from 'morgan'; // Thêm morgan

const { Pool } = pg;

const app = express();
app.use(
  cors({
    origin: '*', // Cho phép tất cả các origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Cho phép tất cả các phương thức
    allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép các header cần thiết
    credentials: false, // Không cần credentials (có thể bật nếu cần)
  })
);
app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin
  console.log(origin)
  
  // for(req_header of requestArray){

  // }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Acces-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Thêm morgan logger
// Tạo format tùy chỉnh để log chi tiết
morgan.token('body', (req) => JSON.stringify(req.body)); // Log body
morgan.token('cookies', (req) => JSON.stringify(req.headers.cookie || 'No cookies')); // Log cookies
morgan.token('auth', (req) => req.headers['authorization'] || 'No auth header'); // Log token (Authorization header)
morgan.token('user', (req) => (req.user ? JSON.stringify(req.user) : 'No user')); // Log thông tin user từ token

// Sử dụng morgan với format tùy chỉnh
app.use(
  morgan(
    ':method :url :status :response-time ms - Body: :body - Cookies: :cookies - Auth: :auth - User: :user'
  )
);

// Kết nối đến DB host trên Neon
const pool = new Pool({
  connectionString:
    'postgresql://Linglooma_owner:npg_KZsn7Wl3LOdu@ep-snowy-fire-a831dkmt-pooler.eastus2.azure.neon.tech/Linglooma?sslmode=require',
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
  res.json({
    "dav" : "69 chua lang"
  })
});

app.post('/api/abc', async(req, res) => {
  const {username, password} = req.body;
  console.log("Anh yeu vcl")
  console.log(username);
  console.log(password);
  res.send("Dit con me cay vcl")
}) 

// Login)
app.post('/api/login', async (req, res) => {
  const {data, message} = req.body;
  console.log(data);
  console.log(message)
  const { username, password } = req.body;
  console.log(username);
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
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items WHERE created_by = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/items', async (req, res) => {
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