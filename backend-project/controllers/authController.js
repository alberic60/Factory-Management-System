import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Invalid password" });

  req.session.user = user;

  res.json({ message: "Login successful" });
};

const register = async(req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "Username already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        password: hashedPassword
    });
    await newUser.save();
    res.json({ message: "User registered successfully" });
};

const logout = (req, res) => {
    req.session.destroy();
    res.json({ message: "Logout successful" });
};

export default { login, register, logout };