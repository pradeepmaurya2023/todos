const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

require("dotenv").config(); // Make sure this is at the top

// Users file path
const usersPath = path.join(__dirname, "../data/users.json");

const JWT_SECRET = process.env.JWT_SECRET;

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


// User signup logic
function signUp(req, res) {
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
}


// User signin logic an generating a JWT token
function signIn(req, res) {
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
}

module.exports = {
  signUp,
  signIn,
};
