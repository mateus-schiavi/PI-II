const express = require('express');
const app = express();
require('./config/database');
const inventoryRoutes = require('./routes/inventoryRoutes');

app.use(express.json());
app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

