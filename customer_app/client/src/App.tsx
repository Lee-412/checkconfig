import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    console.log("Hello world");
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit', // Tương đương withCredentials: false
        body: JSON.stringify({ username, password }),
      });
      alert("dit me status code: " + res.status);
      // if (!res.ok) {
      //   throw new Error(`HTTP error! Status: ${res.status}`);
      // }

      const data = await res.json(); // Parse response thành JSON
      console.log(data);
      console.log(res.status);
      alert(JSON.stringify(data));
      localStorage.setItem('token', data.token);
      window.location.href = '/items';
    } catch (err) {
      alert(err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

function Items() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('http://localhost/api/items', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch items');

      const data = await res.json();
      setItems(data);
    } catch (err) {
      alert('Failed to fetch items');
    }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error('Failed to create item');

      fetchItems();
      setName('');
    } catch (err) {
      alert('Failed to create item');
    }
  };

  return (
    <div>
      <h1>Items</h1>
      <form onSubmit={handleCreate}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map(item => (
          // @ts-ignore
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Login</Link> | <Link to="/items">Items</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/items" element={<Items />} />
      </Routes>
    </Router>
  );
}

export default App;