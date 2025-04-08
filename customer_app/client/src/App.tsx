import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useConfirmBox } from './useComfirmBox';
import { Toaster , toast } from 'sonner';

// Định nghĩa interface cho Item
interface Item {
  id: number;
  name: string;
  description: string;
  img: string;
}
interface Users {
  id: number;
  username: string;
  role: RoleUser;
}


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    console.log(username, password);

    try {
      const res = await fetch('http://localhost/api/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      console.log("fucking data: " + JSON.stringify(data)); 
      
      if (res.ok) {
        localStorage.setItem('token', data.authData);
        window.location.href = '/items';
      } else {
        setError(`Login failed: ${res.status}`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      width: '100%',
      background: '#f4f6f9',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          padding: '25px',
          background: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <h2 style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '26px',
          fontWeight: '600',
          color: '#2c3e50'
        }}>
          Login
        </h2>
        {error && (
          <p style={{
            color: '#e74c3c',
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '14px',
            padding: '8px',
            background: '#ffe6e6',
            borderRadius: '4px'
          }}>
            {error}
          </p>
        )}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{
            width: '100%',
            padding: '12px 15px',
            marginBottom: '15px',
            border: '1px solid #dfe6e9',
            borderRadius: '6px',
            fontSize: '16px',
            color: '#2d3436',
            background: '#f9fbfc',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3498db';
            e.currentTarget.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#dfe6e9';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width: '100%',
            padding: '12px 15px',
            marginBottom: '20px',
            border: '1px solid #dfe6e9',
            borderRadius: '6px',
            fontSize: '16px',
            color: '#2d3436',
            background: '#f9fbfc',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3498db';
            e.currentTarget.style.boxShadow = '0 0 5px rgba(52, 152, 219, 0.3)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#dfe6e9';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: '#3498db',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#2980b9';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(41, 128, 185, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#3498db';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Login
        </button>
      </form>
    </div>
  );
}

function ItemsPremium() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Phân biệt create hay edit
  const [editItemId, setEditItemId] = useState<number | null>(null); // ID của item đang edit
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost/api/api/vipitems', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("get items premium successfully");
        setItems(Array.isArray(data) ? data : []);
      } else {
        toast.warning("You don't have Permission to access this action");

        console.log("bug in res", res.status);
        setItems([]);
      }
    } catch (err) {
      toast.error("something wrong");

      setError(`Error: ${err}`);
      setItems([]);
    }
  };

  const handleCreate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/api/api/vipitems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, description, img }),
      });

      if (res.ok) {
        fetchItems();
        toast.success("Item premium create successfully!")

        resetForm();
        setIsModalOpen(false);
      } else {
        toast.warning("you don't have permission create items premium!")

        console.log("bug in res", res.status);
        setError(`Create failed: ${res.status}`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  const handleEdit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (editItemId === null) return;
    setError('');
    try {
      const res = await fetch(`http://localhost/api/api/vipitems/${editItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, description, img }),
      });
      
      if (res.ok) {
        fetchItems();
        toast.success("Item edit premium successfully!")

        resetForm();
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditItemId(null);
      } else {
        toast.warning("You don't have permission edit Items premium");

        console.log("bug in res", res.status);
        setError(`Edit failed: ${res.status}`);
      }
    } catch (err) {
      toast.error("Something wrong with server");

      setError(`Error: ${err}`);
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      const res = await fetch(`http://localhost/api/api/vipitems/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        fetchItems();
        toast.success("Item premium deleted successfully!")
      } else {
        toast.warning("You don't have permission delete Items premium");
        console.log("bug in res", res.status);
        setError(`Delete failed: ${res.status}`);
      }
    } catch (err) {
      toast.error("Something wrong with server");
      setError(`Error: ${err}`);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setImg('');
    setError('');
  };

  const openEditModal = (item: Item) => {
    setName(item.name);
    setDescription(item.description);
    setImg(item.img);        

    setEditItemId(item.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 80px)',
      padding: '30px 0',
      background: '#f4f6f9',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>

      <h1 style={{
        textAlign: 'center',
        marginBottom: '25px',
        fontSize: '28px',
        fontWeight: '600',
        color: '#2c3e50'
      }}>
        Premium Items
      </h1>
      {error && (
        <p style={{
          color: '#e74c3c',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '14px',
          padding: '8px',
          background: '#ffe6e6',
          borderRadius: '4px',
          width: '80%',
          maxWidth: '800px'
        }}>
          {error}
        </p>
      )}
      <button
        onClick={() => {
          resetForm();
          setIsEditMode(false);
          setIsModalOpen(true);
        }}
        style={{
          padding: '12px 25px',
          background: '#2ecc71',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '30px',
          transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#27ae60';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(39, 174, 96, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#2ecc71';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Add New Premium Item
      </button>
      <Toaster position="top-right" richColors />

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <form
            onSubmit={isEditMode ? handleEdit : handleCreate}
            style={{
              background: '#ffffff',
              padding: '25px',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '500px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              transition: 'all 0.3s ease'
            }}
          >
            <h2 style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '22px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              {isEditMode ? 'Edit Premium Item' : 'Create New Premium Item'}
            </h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
              style={{
                padding: '12px 15px',
                border: '1px solid #dfe6e9',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#2d3436',
                background: '#f9fbfc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dfe6e9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              style={{
                padding: '12px 15px',
                border: '1px solid #dfe6e9',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#2d3436',
                background: '#f9fbfc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dfe6e9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <input
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="Image URL"
              style={{
                padding: '12px 15px',
                border: '1px solid #dfe6e9',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#2d3436',
                background: '#f9fbfc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dfe6e9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditItemId(null);
                }}
                style={{
                  padding: '10px 20px',
                  background: '#e74c3c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, transform 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#c0392b')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#e74c3c')}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#2ecc71',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#27ae60';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(39, 174, 96, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#2ecc71';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <table
        style={{
          width: '100%',
          maxWidth: '1200px',
          borderCollapse: 'separate',
          borderSpacing: '0',
          background: '#ffffff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          borderRadius: '10px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>ID</th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>Name</th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>Description</th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>Image</th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item) => (
              <tr
                key={item.id}
                style={{ borderBottom: '1px solid #ecf0f1', transition: 'background 0.2s ease' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f9fbfc')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>{item.id}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>{item.name}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>{item.description}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image')}
                  />
                </td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>
                  <button
                    onClick={() => openEditModal(item)}
                    style={{
                      padding: '6px 12px',
                      background: '#3498db',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px',
                      transition: 'background 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#2980b9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#3498db')}
                  >
                    Edit
                  </button>
                 
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#e74c3c',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#c0392b')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#e74c3c')}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center', fontSize: '15px', color: '#7f8c8d' }}>
                No premium items available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Phân biệt create hay edit
  const [editItemId, setEditItemId] = useState<number | null>(null); // ID của item đang edit

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost/api/api/items', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok) {
        setItems(Array.isArray(data) ? data : []);
        toast.success('Items fetched successfully');
      } else {
        console.log("bug in res", res.status);
        setItems([]);
        toast.warning("You don't have permission");
      }
    } catch (err) {
      setError(`Error: ${err}`);
      toast.error("Something wrong with server");

      setItems([]);
    }
  };

  const handleCreate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/api/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, description, img }),
      });

      if (res.ok) {
        fetchItems();
        resetForm();
        toast.success(
          'Item created successfully'
        )
        setIsModalOpen(false);
      } else {
        toast.warning("You don't have permission create items")
        console.log("bug in res", res.status);
        setError(`Create failed: ${res.status}`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  const handleEdit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (editItemId === null) return;
    setError('');
    try {
      const res = await fetch(`http://localhost/api/api/items/${editItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, description, img }),
      });

      if (res.ok) {
        fetchItems();
        toast.success(
          'Item updated successfully'
        )
        resetForm();
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditItemId(null);
      } else {
        toast.warning("You don't have permission edit items")

        console.log("bug in res", res.status);
        setError(`Edit failed: ${res.status}`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
      toast.error("something wrong with server")

    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    console.log("id", id)
    try {
      const res = await fetch(`http://localhost/api/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        fetchItems();
        toast.success('Item deleted successfully');
      } else {
        toast.warning("You don't have permission delete items")

        console.log("bug in res", res.status);
        setError(`Delete failed: ${res.status}`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
      toast.error("Something went wrong")

    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setImg('');
    setError('');
  };

  const openEditModal = (item: Item) => {
    setName(item.name);
    setDescription(item.description);
    setImg(item.img);
    setEditItemId(item.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 80px)',
      padding: '30px 0',
      background: '#f4f6f9',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '25px',
        fontSize: '28px',
        fontWeight: '600',
        color: '#2c3e50'
      }}>
        Items
      </h1>
      {error && (
        <p style={{
          color: '#e74c3c',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '14px',
          padding: '8px',
          background: '#ffe6e6',
          borderRadius: '4px',
          width: '80%',
          maxWidth: '800px'
        }}>
          {error}
        </p>
      )}
      <button
        onClick={() => {
          resetForm();
          setIsEditMode(false);
          setIsModalOpen(true);
        }}
        style={{
          padding: '12px 25px',
          background: '#2ecc71',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '30px',
          transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#27ae60';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(39, 174, 96, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#2ecc71';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Add New Item
      </button>
      <Toaster position="top-right" richColors />

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <form
            onSubmit={isEditMode ? handleEdit : handleCreate}
            style={{
              background: '#ffffff',
              padding: '25px',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '500px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              transition: 'all 0.3s ease'
            }}
          >
            <h2 style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '22px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              {isEditMode ? 'Edit Item' : 'Create New Item'}
            </h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
              style={{
                padding: '12px 15px',
                border: '1px solid #dfe6e9',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#2d3436',
                background: '#f9fbfc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dfe6e9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              style={{
                padding: '12px 15px',
                border: '1px solid #dfe6e9',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#2d3436',
                background: '#f9fbfc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dfe6e9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <input
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="Image URL"
              style={{
                padding: '12px 15px',
                border: '1px solid #dfe6e9',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#2d3436',
                background: '#f9fbfc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dfe6e9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditItemId(null);
                }}
                style={{
                  padding: '10px 20px',
                  background: '#e74c3c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, transform 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#c0392b')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#e74c3c')}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#2ecc71',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#27ae60';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(39, 174, 96, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#2ecc71';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <table
        style={{
          width: '100%',
          maxWidth: '1200px',
          borderCollapse: 'separate',
          borderSpacing: '0',
          background: '#ffffff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          borderRadius: '10px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>ID</th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>Name</th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>Description</th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>Image</th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item) => (
              <tr
                key={item.id}
                style={{ borderBottom: '1px solid #ecf0f1', transition: 'background 0.2s ease' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f9fbfc')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>{item.id}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>{item.name}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>{item.description}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image')}
                  />
                </td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>
                  <button
                    onClick={() => openEditModal(item)}
                    style={{
                      padding: '6px 12px',
                      background: '#3498db',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px',
                      transition: 'background 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#2980b9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#3498db')}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#e74c3c',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#c0392b')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#e74c3c')}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center', fontSize: '15px', color: '#7f8c8d' }}>
                No items available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

enum RoleUser {
  Admin = 'admin',
  User = 'user',
  UserPremium = 'premium'
}

interface Users {
  id: number;
  username: string; // Đổi từ name thành username để khớp với yêu cầu mới
  password: string; // Password đã hash
  role: RoleUser;
}

function Users() {
  const [users, setUsers] = useState<Users[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleUser>(RoleUser.User);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Để phân biệt create hay edit
  const [editUserId, setEditUserId] = useState<number | null>(null); // ID của user đang edit

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost/api/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      console.log("dataa User", data);

      if (res.ok && Array.isArray(data)) {
        setUsers(data);
        toast.success("User fetched successfully");
      } else {
        toast.warning("You don't have permission with get user");

        console.log("bug in res", res.status);
        setUsers([]);
      }
    } catch (err) {
      toast.error("something wrong");

      setError(`Error: ${err}`);
      setUsers([]);
    }
  };

  const handleCreate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/api/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (res.ok) {
        fetchUsers();
        toast.success("created successfully");
        resetForm();
        setIsModalOpen(false);
      } else {
        toast.warning("you don't have permission to action");

        console.log("bug in res", res.status);
        setError(`Create failed: ${res.status}`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  const handleEdit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (editUserId === null) return;
    console.log(editUserId);

    setError('');
    try {
      const res = await fetch(`http://localhost/api/api/users/${editUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (res.ok) {
        fetchUsers();
        resetForm();
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditUserId(null);
      } else {
        console.log("bug in res", res.status);
        setError(`Edit failed: ${res.status}`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      const res = await fetch(`http://localhost/api/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        fetchUsers();
      } else {
        console.log("bug in res", res.status);
        setError(`Delete failed: ${res.status}`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setRole(RoleUser.User);
    setError('');
  };

  const openEditModal = (user: Users) => {
    setUsername(user.username);
    setPassword(''); // Không điền sẵn password để yêu cầu nhập lại nếu muốn đổi
    setRole(user.role);
    setEditUserId(user.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 80px)',
      padding: '30px 0',
      background: '#f4f6f9',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '25px',
        fontSize: '28px',
        fontWeight: '600',
        color: '#2c3e50'
      }}>
        Users
      </h1>
      {error && (
        <p style={{
          color: '#e74c3c',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '14px',
          padding: '8px',
          background: '#ffe6e6',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '1200px'
        }}>
          {error}
        </p>
      )}
      <Toaster position="top-right" richColors />

      <button
        onClick={() => {
          resetForm();
          setIsEditMode(false);
          setIsModalOpen(true);
        }}
        style={{
          padding: '12px 25px',
          background: '#2ecc71',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '30px',
          transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#27ae60';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(39, 174, 96, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#2ecc71';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Add New User
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <form
            onSubmit={isEditMode ? handleEdit : handleCreate}
            style={{
              background: '#ffffff',
              padding: '25px',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '500px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              transition: 'all 0.3s ease'
            }}
          >
            <h2 style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '22px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              {isEditMode ? 'Edit User' : 'Create New User'}
            </h2>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{
                padding: '12px 15px',
                border: '1px solid #dfe6e9',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#2d3436',
                background: '#f9fbfc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dfe6e9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditMode ? "New password (leave blank to keep)" : "Password"}
              style={{
                padding: '12px 15px',
                border: '1px solid #dfe6e9',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#2d3436',
                background: '#f9fbfc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dfe6e9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RoleUser)}
              style={{
                padding: '12px 15px',
                border: '1px solid #dfe6e9',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#2d3436',
                background: '#f9fbfc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2ecc71';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#dfe6e9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value={RoleUser.Admin}>Admin</option>
              <option value={RoleUser.User}>User</option>
              <option value={RoleUser.UserPremium}>Premium</option>
            </select>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditUserId(null);
                }}
                style={{
                  padding: '10px 20px',
                  background: '#e74c3c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, transform 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#c0392b')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#e74c3c')}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#2ecc71',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#27ae60';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(39, 174, 96, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#2ecc71';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <table
        style={{
          width: '100%',
          maxWidth: '1200px',
                    borderCollapse: 'separate',
          borderSpacing: '0',
          background: '#ffffff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          borderRadius: '10px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>
              ID
            </th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>
              Username
            </th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>
              Password (Hashed)
            </th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>
              Role
            </th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '16px', fontWeight: '600', color: '#34495e', borderBottom: '2px solid #dfe6e9' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                style={{ borderBottom: '1px solid #ecf0f1', transition: 'background 0.2s ease' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f9fbfc')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>
                  {user.id}
                </td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>
                  {user.username}
                </td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.password}
                </td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>
                  {user.role}
                </td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#2d3436' }}>
                  <button
                    onClick={() => openEditModal(user)}
                    style={{
                      padding: '6px 12px',
                      background: '#3498db',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px',
                      transition: 'background 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#2980b9')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#3498db')}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#e74c3c',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#c0392b')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#e74c3c')}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5} // Tăng colSpan lên 5 vì thêm cột Password và Actions
                style={{ padding: '20px', textAlign: 'center', fontSize: '15px', color: '#7f8c8d' }}
              >
                No users available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav
        style={{
          padding: '15px 20px',
          background: '#2c3e50',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          margin: 0,
          transition: 'all 0.3s ease'
        }}
      >
        <Link
          to="/"
          style={{
            color: '#ffffff',
            margin: '0 20px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'color 0.3s ease, transform 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#3498db';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Login
        </Link>
        <Link
          to="/items"
          style={{
            color: '#ffffff',
            margin: '0 20px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'color 0.3s ease, transform 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#3498db';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Items
        </Link>
        <Link
          to="/users"
          style={{
            color: '#ffffff',
            margin: '0 20px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'color 0.3s ease, transform 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#3498db';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Users
        </Link>
        <Link
          to="/itempremium"
          style={{
            color: '#ffffff',
            margin: '0 20px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'color 0.3s ease, transform 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#3498db';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Item Premium
        </Link>
      </nav>
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        paddingTop: '80px',
        background: '#f4f6f9',
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 20px',
          boxSizing: 'border-box'
        }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/items" element={<Items />} />
            <Route path="/users" element={<Users />} />
            <Route path="/itempremium" element={<ItemsPremium></ItemsPremium>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;