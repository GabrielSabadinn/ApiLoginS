// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Simulação de um banco de dados de usuários
// 'tipoUsuario' será usado para distinguir entre Cliente e Prestador
const users = [
  { email: 'cliente@example.com', password: bcrypt.hashSync('password123', 8), tipoUsuario: 'cliente' },
  { email: 'prestador@example.com', password: bcrypt.hashSync('password123', 8), tipoUsuario: 'prestador' }
];

// Função para gerar o token JWT
const generateToken = (user) => {
  return jwt.sign({ email: user.email, tipoUsuario: user.tipoUsuario }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Expira conforme configurado no .env
  });
};

// Função para gerar o refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email, tipoUsuario: user.tipoUsuario }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, // Expira conforme configurado no .env
  });
};

// Função de login com verificação de tipo de usuário
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Verificar se o usuário existe no banco de dados simulado
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Email ou senha inválidos' });
  }

  // Verificar se a senha está correta
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(400).json({ message: 'Email ou senha inválidos' });
  }

  // Gera token e refresh token
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  // Retorna o token e o tipo de usuário
  return res.status(200).json({
    token,
    refreshToken,
    tipoUsuario: user.tipoUsuario, // Cliente ou Prestador
  });
};

// Função para resetar a senha
exports.resetPassword = (req, res) => {
  const { email, newPassword } = req.body;

  // Verificar se o usuário existe
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  // Atualizar a senha do usuário
  user.password = bcrypt.hashSync(newPassword, 8);

  return res.status(200).json({ message: 'Senha atualizada com sucesso' });
};
