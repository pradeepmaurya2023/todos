const express = require("express");
const { v4: uuidv4 } = require("uuid");
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

const router = express.Router();

let todosPath = path.join(__dirname, "../data/todos.json");

// Read todos
function readTodos() {
  try {
    const data = fs.readFileSync(todosPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error reading todos.json");
    return [];
  }
}

// Write todos
function writeTodos(todos) {
  fs.writeFileSync(todosPath, JSON.stringify(todos, null, 2), "utf-8");
}

// Load todos into memory
let todos = readTodos();

// Get all todos for logged-in user
router.get("/", auth, (req, res) => {
  let username = req.user.username;
  let userSpecificTodos = todos.filter((todo) => todo.username === username);

  if (userSpecificTodos.length < 1) {
    return res.json({ msg: "No Todos Found", todos: [] });
  }

  res.json({
    todos: userSpecificTodos.sort((a, b) => a.title.localeCompare(b.title)),
  });
});

// Get specific todo by ID (only if it belongs to user)
router.get("/:id", auth, (req, res) => {
  let username = req.user.username;
  let id = req.params.id;

  let todo = todos.find((todo) => todo.id === id && todo.username === username);
  if (!todo) {
    return res.status(404).json({ msg: "Todo not found or unauthorized" });
  }
  res.json({ ...todo });
});

// Add a new todo
router.post("/", auth, (req, res) => {
  const { title, completed } = req.body;
  const username = req.user.username;
  const id = uuidv4();

  if (typeof title === "string" && typeof completed === "boolean") {
    todos.push({
      id,
      username,
      title,
      completed,
    });
    writeTodos(todos);
    res.json({ msg: "Todo added successfully" });
  } else {
    res.status(400).json({ msg: "Title and Completed must be valid" });
  }
});

// Update a todo
router.put("/:id", auth, (req, res) => {
  const id = req.params.id;
  const username = req.user.username;
  const { title, completed } = req.body;

  let todoFound = false;

  todos.forEach((todo) => {
    if (todo.id === id && todo.username === username) {
      if (title !== undefined) todo.title = title;
      if (completed !== undefined) todo.completed = completed;
      todoFound = true;
    }
  });

  if (!todoFound) {
    return res.status(404).json({ msg: "Todo not found or unauthorized" });
  }

  writeTodos(todos);
  res.json({ msg: "Todo updated successfully" });
});

// Delete a todo
router.delete("/:id", auth, (req, res) => {
  const id = req.params.id;
  const username = req.user.username;

  const updatedTodos = todos.filter(
    (todo) => !(todo.id === id && todo.username === username)
  );

  if (updatedTodos.length === todos.length) {
    return res.status(404).json({ msg: "Todo not found or unauthorized" });
  }

  todos = updatedTodos;
  writeTodos(todos);
  res.json({ msg: "Todo deleted successfully" });
});

module.exports = router;
