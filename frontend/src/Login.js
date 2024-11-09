import React, { useState } from 'react';

const Login = ({ onLogin, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const userData = { email, password };
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }
  
      const data = await response.json();
      alert(data.message);  // Exibe a mensagem do backend
  
      if (response.ok) {
        onLogin(true);  // Se o login for bem-sucedido
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Houve um erro ao tentar fazer login.');
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
      <p>Não tem uma conta? <button onClick={onGoToRegister}>Registrar-se</button></p>
    </div>
  );
};

export default Login;
