import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e: { preventDefault: () => void; }) => {
//     console.log("Hello world");
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost/api/login',
//         { username, password },
//         {
//           withCredentials: false
//         }
//       );

//       const data = res.data; // Không cần .json()
//       console.log(data); // In trực tiếp object
//       console.log(res.status); // Status code (e.g., 200)
//       alert(JSON.stringify(data));
//       localStorage.setItem('token', data.token);
//       window.location.href = '/items';
//     } catch (err) {
//       alert(err);
//     }
//   };
//   return (
//     <form onSubmit={handleLogin}>
//       <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
//       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
//       <button type="submit">Login</button>
//     </form>
//   );
// }

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

// Tạo instance của axios với config mặc định
// const axiosInstance = axios.create({
//   baseURL: 'http://localhost',
//   withCredentials: false,
// });

// // Thêm interceptor cho response
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Status 200-299: Trả về response bình thường
//     return response;
//   },
//   (error) => {
//     // Xử lý lỗi, nhưng vẫn cho phép các status như 304, 400, 500 đi qua mà không throw
//     if (error.response) {
//       // Nếu có response (như 304, 400, 500), trả về để xử lý trong try
//       return Promise.resolve(error.response);
//     }
//     // Nếu không có response (network error), throw error
//     return Promise.reject(error);
//   }
// );

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e: { preventDefault: () => void; }) => {
//     console.log("Hello world");
//     e.preventDefault();
//     try {
//       const res = await axiosInstance.post('/api/login', { username, password });

//       const data = res.data;
//       console.log('Data:', data);
//       console.log('Status:', res.status);

//       // Xử lý theo status code
//       if (res.status === 200) {
//         alert('Login successful: ' + JSON.stringify(data));
//         localStorage.setItem('token', data.token);
//         window.location.href = '/items';
//       } else if (res.status === 304) {
//         alert('Not modified: ' + JSON.stringify(data));
//       } else if (res.status === 400) {
//         alert('Bad request: ' + JSON.stringify(data));
//       } else if (res.status === 500) {
//         alert('Server error: ' + JSON.stringify(data));
//       } else {
//         alert('Unexpected status: ' + res.status + ' - ' + JSON.stringify(data));
//       }
//     } catch (err) {
//       // Chỉ catch các lỗi thật sự (như network error)
//       console.log('Error:', err);
//       alert('Network error: ' + err);
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
//       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
//       <button type="submit">Login</button>
//     </form>
//   );
// }

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