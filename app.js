const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');


dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/management', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}|Servidor rodando na porta ${PORT}`);
});