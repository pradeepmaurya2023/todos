const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Make sure this is at the top

// auth middleware
const auth = require("./middleware/auth");

// todos routes
const todosRoutes = require("./routes/todos");

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Users file path
const usersPath = path.join(__dirname, "/data/users.json");

// Helper to read users
function readUsers() {
  try {
    const data = fs.readFileSync(usersPath, "utf-8");
    return JSON.parse(data); // Must return an array
  } catch (err) {
    console.error("Error reading users.json:", err);
    return [];
  }
}

// Helper to write users
function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");
}

// Middlewares
app.use(express.json());
app.use(express.static("public")); // serve public folder

// Routes
app.use("/todos", todosRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Home route");
});

// Sign up route
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    let users = readUsers();
    if (users.find((user) => user.username === username)) {
      res.status(409).json({
        msg: "Username Already Exists, Try a different Username",
      });
    } else {
      users.push({ username, password });
      writeUsers(users);
      res.status(200).json({
        msg: "You have Successfully Signed Up",
      });
    }
  } else {
    res.status(400).json({
      msg: "Username and Password cannot be Empty",
    });
  }
});

// Sign in route
app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    let users = readUsers(); // ✅ read fresh users from file
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      const token = jwt.sign({ username }, JWT_SECRET);
      res.json({
        token,
        msg: "You have Successfully Signed In",
      });
    } else {
      res.status(403).json({
        msg: "Incorrect Credentials",
      });
    }
  } else {
    res.status(400).json({
      msg: "Username and Password cannot be Empty",
    });
  }
});

// Protected route test
app.get("/protected", auth, (req, res) => {
  const user = req.user;
  res.json({
    msg: `Hello ${user.username}`,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
