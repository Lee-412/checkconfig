
import express from 'express';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import morgan from 'morgan'; // Thêm morgan
import vipRouter from './routes/vipRoutesAfter';
import itemRouter from './routes/itemRoutesAfter';
import userRouter from './routes/userRoutesAfter';

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

app.use('/items', itemRouter);
app.use('/vipitems', vipRouter); // Virtual
app.use('/users', userRouter); // User

app.get('/', async (req, res) => {
  res.json({
    "dav" : "69 chua lang"
  })
});

app.post('/abc', async(req, res) => {
  const {username, password} = req.body;
  console.log("Anh yeu vcl")
  console.log(username);
  console.log(password);
  res.send("Dit con me cay vcl")
}) 
app.post('/register', async(req, res) => {
  const {data, message} = req.body;
  console.log(data);
  console.log(message)
  const { username, password, role } = req.body;
  console.log(username);
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    console.log(result.rows);
    
    if(result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, role]
      );
      return res.json({message: "success", result: result.rows[0]});
    }
    return res.status(409).json({ message: 'Username already exists' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }

})
// Login)
app.post('/login', async (req, res) => {
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


app.listen(8081, () => {
  console.log('Server running on port 8081');
});