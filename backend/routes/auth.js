const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se o usuário já existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Usuário já existe' });
  }

  // Criar novo usuário
  const user = new User({ name, email, password });

  try {
    await user.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: err });
  }
});

// Rota para fazer login do usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  // Verificar se a senha corresponde
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: 'Senha inválida' });
  }

  // Se as credenciais estiverem corretas, retornar mensagem de sucesso
  res.status(200).json({ message: 'Login bem-sucedido' });
});

module.exports = router;
