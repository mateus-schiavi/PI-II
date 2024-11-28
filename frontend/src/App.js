import React, { useState } from 'react';
import InventoryList from './InventoryList'; 
import Login from './Login';
import Register from './Register';  // Importando o novo componente de registro
import './App.css';
import logotipo from './assets/logotipo.png'
const App = () => {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);  // Estado para controlar a navegação

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleGoToRegister = () => {
    setIsRegistering(true);  // Muda para a tela de registro
  };

  const handleGoToLogin = () => {
    setIsRegistering(false);  // Muda para a tela de login
  };

  return (
    <div>
      <img src={logotipo} alt='Logo ' style={{width: '250px', height: 'auto'}}/>
      {
        isLoggedin ? (
          <InventoryList onLogout={handleLogout} />
        ) : isRegistering ? (
          <Register onGoToLogin={handleGoToLogin} />  // Renderiza a tela de registro
        ) : (
          <Login onLogin={setIsLoggedIn} onGoToRegister={handleGoToRegister} />  // Renderiza a tela de login
        )
      }
    </div>
  );
};

export default App;
