const express = require("express");
const auth = require("../middleware/auth");
const {
  getTodos,
  getTodoById,
  addTodo,
  updateTodoById,
  deleteTodoById,
} = require("../controllers/todosController");

const router = express.Router();

// Get all todos for logged-in user
router.get("/", auth, getTodos);

// Get specific todo by ID (only if it belongs to user)
router.get("/:id", auth, getTodoById);

// Add a new todo
router.post("/", auth, addTodo);

// Update a todo
router.put("/:id", auth, updateTodoById);

// Delete a todo
router.delete("/:id", auth, deleteTodoById);

module.exports = router;
