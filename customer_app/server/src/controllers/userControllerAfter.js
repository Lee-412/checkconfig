import pg from 'pg';
import bcrypt from 'bcrypt';


const { Pool } = pg;

const pool = new Pool({
  connectionString:
    'postgresql://Linglooma_owner:npg_KZsn7Wl3LOdu@ep-snowy-fire-a831dkmt-pooler.eastus2.azure.neon.tech/Linglooma?sslmode=require',
});

const SECRET = 'your-secret-key';

let users = []

// Get all users
export const getUsers = async(req, res) => {
  const authData = req.body?.authData
  console.log(authData);
    // Fetch from database in real case
    try {
      const result = await pool.query("SELECT * FROM users ORDER BY id")
      const items = result.rows
      console.log(items);
      
      return res.json(items);
    }catch (err){
      return res.status(500).json({message: err.message});
    }
  };

export const getUserById = async(req, res) => {
  const authData = req.body?.authData
  console.log(authData);
    // Fetch from database in real case
  const user_id = req.params.id
  console.log(item_id);
  
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [user_id])
    const items = result.rows
    console.log(items);
    
    return res.json(items);
  }catch (err){
    return res.status(500).json({message: err.message});
  }
  };
// Create a new user
export const createUser = async(req, res) => {
  const authData = req.body?.authData
  console.log(authData);
  const hashedPassword = await bcrypt.hash(req.body.password)
  const user = {
    username: req.body.username,
    password: hashedPassword,
    role : req.body.role
  };
  try {
    const result = await pool.query("INSERT INTO users (username, password, role) VALUES ($1, $2, $3)", [user.username, user.password, user.role])
    // items.push(result.rows[0])
    console.log(user);
    
    return res.json(result.rows[0]);
  }
  catch (err){
    return res.status(500).json({message: err.message});
  }

    // Save to database in real case
    // res.status(201).json(user);
  };
  // Update a user
  export const updateUser = async(req, res) => {
    const authData = req.body?.authData
    console.log(authData);
    const { id } = req.params;
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    
    try {
      const exists = await pool.query("SELECT username FROM users WHERE id = $1", [id])
      if (exists.rows.length == 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const result = await pool.query("UPDATE users SET username = $1, password = $2, role = $3 WHERE id = $4", [username, hashedPassword, role, id])
      console.log(result);
      
      return res.json(result.rows[0]);
    } catch(err){
      return res.status(500).json({message: err.message});
    }

    // Save to database in real case
    // res.json(users[userIndex]);
  };
  // Delete a user

  export const deleteUser = async(req, res) => {
    const authData = req.body?.authData
    console.log(authData);
    const user_id = req.params.id
  try {
    const exists = await pool.query("SELECT id FROM users WHERE id = $1", [user_id])
    if (exists.rows.length == 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const result = await pool.query("DELETE FROM users WHERE id = $1", [user_id])
    console.log(result);
    
    return res.json(result.rows[0]);
  } catch(err){
    return res.status(500).json({message: err.message});
  }
    // Save to database in real case
    // res.json({ message: 'User deleted' });
  };
  