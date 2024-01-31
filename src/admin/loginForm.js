import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ici, vous pouvez envoyer une requête à votre serveur pour vérifier les identifiants
      const response = await axios.post('https://maro.alwaysdata.net/api/login', credentials);
      // Si la connexion est réussie, rediriger vers la page admin
      login(response.data);
      navigate('/admin');
    } catch (error) {
      // Gérer les erreurs ici
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className='d-flex flex-column justify-content-center mt-5'>
      <h2 className='text-center'>Connexion</h2>
      <form className='form form-control w-50 mx-auto' onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>Nom d'utilisateur:</label>
          <input 
            type="text" 
            name="username" 
            value={credentials.username} 
            onChange={handleChange} 
            className='form-control'
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Mot de passe:</label>
          <input 
            type="password" 
            name="password" 
            value={credentials.password} 
            onChange={handleChange} 
            className='form-control'
          />
        </div>
        <div className='d-flex justify-content-center'><button className='btn btn-primary w-50' type="submit">Connexion</button></div>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginForm;
