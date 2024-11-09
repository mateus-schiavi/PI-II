// Importações
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); // Supondo que as rotas de autenticação estejam nesse arquivo

const app = express();

// Middlewares
app.use(cors()); // Habilita o CORS para todas as requisições
app.use(express.json()); // Garante que o corpo da requisição seja interpretado como JSON

// Conexão com o MongoDB (substitua pela sua URL de conexão)
mongoose.connect('mongodb://localhost:27017/seubanco', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

// Usando as rotas de autenticação
app.use('/api/auth', authRoutes);

// Definindo a porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
