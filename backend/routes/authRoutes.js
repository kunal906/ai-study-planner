const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = [];

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = users.find((user) => user.email === email);
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = { id: Date.now().toString(), name, email, password };
    users.push(user);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((entry) => entry.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
