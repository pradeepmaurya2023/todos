const Todo = require("../models/Todo");

// Get all todos for logged-in user
async function getTodos(req, res) {
  let username = req.user.username;

  try {
    let userSpecificTodos = await Todo.find({ username: username });
    if (userSpecificTodos.length < 1) {
      return res.json({ msg: "No Todos Found", todos: [] });
    }
    res.json({
      todos: userSpecificTodos.sort((a, b) => a.title.localeCompare(b.title)),
    });
  } catch (err) {
    console.log("Error while fetching Todos ", err.message);
  }
}

// Get specific todo by ID (only if it belongs to user)
async function getTodoById(req, res) {
  let id = req.params.id;

  try {
    let todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ msg: "Todo not found or unauthorized" });
    }
    res.json({ ...todo });
  } catch (err) {
    console.log("Error while fetching Todo By ID ", err.message);
  }
}

// Add a new todo
async function addTodo(req, res) {
  const { title, completed } = req.body;
  const username = req.user.username;
  try {
    if (typeof title === "string" && typeof completed === "boolean") {
      let todo = new Todo({
        username,
        title,
        completed,
      });
      await todo.save();
      res.json({ msg: "Todo added successfully" });
    } else {
      res.status(400).json({ msg: "Title and Completed must be valid" });
    }
  } catch (err) {
    console.log("Error while Adding a Todo", err.message);
  }
}

// Update a todo
async function updateTodoById(req, res) {
  const id = req.params.id;
  const username = req.user.username;
  const { title, completed } = req.body;
  try {
    let updatedTodo = await Todo.findByIdAndUpdate(id, {
      title: title,
      completed: completed,
    });
    if (!updatedTodo) {
      console.log("User not found");
    } else {
      console.log("Updated User:", updatedTodo);
      res.json({ msg: "Todo updated successfully" });
    }
  } catch (err) {
    console.error("Error updating user:", err.message);
  }
}

// Delete a todo
async function deleteTodoById(req, res) {
  const id = req.params.id;
  try {
    let deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      console.log("Todo not found");
    } else {
      console.log("Todo Deleted Successfully");

      res.json({ msg: "Todo deleted successfully" });
    }
  } catch (err) {
    console.log("Error while Deleting Todo", err.message);
  }
}

module.exports = {
  getTodos,
  getTodoById,
  addTodo,
  updateTodoById,
  deleteTodoById,
};
