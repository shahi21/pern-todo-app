require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;
const pool = new Pool({
    user:"postgres",
    password:"Shahistha16",
    host:"localhost",
    port:5432,
    database:"perntodoapp",
});

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashedPassword]);
  res.json(result.rows[0]);
});

// Login
app.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);  

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (user.rows.length === 0) return res.status(400).json({ msg: "User not found" });

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ user: { id: user.rows[0].id } }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});


// Get Todos
app.get("/todos", verifyToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM todos WHERE user_id = $1", [req.user.id]);
  res.json(result.rows);
});

// Add Todo
app.post("/todos", verifyToken, async (req, res) => {
  const { task } = req.body;
  const result = await pool.query("INSERT INTO todos (user_id, task) VALUES ($1, $2) RETURNING *", [req.user.id, task]);
  res.json(result.rows[0]);
});

// Update Todo
app.put("/todos/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { task} = req.body;
  const result = await pool.query("UPDATE todos SET task = $1, WHERE id = $2 AND user_id = $3 RETURNING *", [task, id, req.user.id]);
  res.json(result.rows[0]);
});

// Delete Todo
app.delete("/todos/:id", verifyToken, async (req, res) => {
  await pool.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
  res.json({ msg: "Todo deleted" });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
