const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { createUser } = require('./controllers/userController');
const questionRoutes = require('./routes/questionRoutes');
const { verifyToken } = require('./middlewares/authMiddleware');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', verifyToken, questionRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

module.exports = app;
