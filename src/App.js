import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const serverUrl = 'YOUR_SERVER_URL'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(serverUrl + 'post_user')
    try {
      await axios.post(serverUrl + 'post_user', { username, email });
      setUsername('');
      setEmail('');
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(serverUrl + 'get_users');
      setUsers(response.data);
      setSuccess(true)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='App'>
      <h1>React App with Flask and MySQL</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Submit</button>
        {success &&
          <img width='20%' src="YOUR_CLOUDFRONT_URL/success.png" alt="" />
        }
      </form>
      <h2>Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
