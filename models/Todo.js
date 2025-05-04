const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  username: String,
  title: {
    type: String,
    required: true,
  },
  completed: Boolean,
});

const Todo = mongoose.model("todos", todoSchema);

module.exports = Todo;
