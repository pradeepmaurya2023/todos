// Check if token is available
const token = localStorage.getItem("token");
console.log("Token is:", token);

if (!token) {
  window.location.href = "index.html";
}

// Logout Logic
const logOut = document.getElementById("logout-btn");
logOut.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// UI Elements
const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-title");

// Utility: Show message inline
function showMessage(message, type = "info") {
  const msgBox = document.getElementById("message-box");
  msgBox.textContent = message;
  msgBox.style.padding = "10px";
  msgBox.style.margin = "10px 0";
  msgBox.style.borderRadius = "5px";
  msgBox.style.color = "#fff";

  if (type === "error") {
    msgBox.style.backgroundColor = "#e74c3c"; // red
  } else if (type === "success") {
    msgBox.style.backgroundColor = "#2ecc71"; // green
  } else {
    msgBox.style.backgroundColor = "#3498db"; // blue
  }

  // Auto-clear message after 3 seconds
  setTimeout(() => {
    msgBox.textContent = "";
    msgBox.style.padding = "0";
  }, 3000);
}

// Fetching todos and displaying
async function getTodos() {
  // Show loading message
  todoList.innerHTML = "Loading...";

  try {
    const res = await fetch("/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Unauthorized or error fetching todos");

    const data = await res.json();
    console.log(data.todos);

    todoList.innerHTML = ""; // Clear the loading text

    if (data.todos.length === 0) {
      showMessage("No todos found", "info");
    } else {
      data.todos.forEach((todo) => {
        const li = document.createElement("li");
        li.dataset.id = todo.id;

        li.innerHTML = `
          <span class="todo-title">${todo.title}</span>
          <span class="todo-status">${todo.completed ? "✅" : "❌"}</span>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
          <form class="edit-form hidden">
            <input type="text" class="edit-title-input" value="${todo.title}" />
            <select class="edit-status-select">
              <option value="false" ${
                !todo.completed ? "selected" : ""
              }>Incomplete</option>
              <option value="true" ${
                todo.completed ? "selected" : ""
              }>Completed</option>
            </select>
            <button type="submit">Update</button>
            <button type="button" class="cancel-edit">Cancel</button>
          </form>
        `;
        todoList.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Fetch error:", err);
    showMessage("Session expired or unauthorized. Please login again.", "error");
    localStorage.setItem('token','');
    setTimeout(() => (window.location.href = "index.html"), 1500);
  }
}

// Fetch todos on page load
document.addEventListener("DOMContentLoaded", getTodos);

// Adding a new todo
todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = todoInput.value.trim();
  if (!title) {
    showMessage("Todo cannot be empty", "error");
    return;
  }

  // Disable submit button during request
  const submitBtn = todoForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  try {
    const res = await fetch("/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        completed: false,
      }),
    });

    if (!res.ok) throw new Error("Error adding todo");
    showMessage("Todo added successfully!", "success");
    await getTodos();
    todoInput.value = "";
  } catch (err) {
    console.error("Add error:", err);
    showMessage("Error adding todo", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

// Event delegation for edit, delete & cancel buttons
todoList.addEventListener("click", async (e) => {
  // Edit button clicked
  if (e.target.classList.contains("edit-btn")) {
    const li = e.target.closest("li");
    const form = li.querySelector(".edit-form");
    form.classList.remove("hidden");
  }

  // Cancel button clicked
  if (e.target.classList.contains("cancel-edit")) {
    const form = e.target.closest(".edit-form");
    form.classList.add("hidden");
  }

  // delete button clicked
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest("li");
    const todoId = li.dataset.id;
    const confirmDelete = confirm("Are you sure you want to delete this todo?");
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(`/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete todo");
      }

      await getTodos(); // refresh the list
      showMessage("To-Do Deleted Successfully.", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      showMessage("Error deleting todo", "error");
    }
  }
});

// Update todo logic
todoList.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (e.target.classList.contains("edit-form")) {
    const form = e.target;
    const li = form.closest("li");
    const todoId = li.dataset.id;

    const updatedTitle = form.querySelector(".edit-title-input").value.trim();
    const updatedStatus =
      form.querySelector(".edit-status-select").value === "true";

    if (!updatedTitle) {
      showMessage("Title cannot be empty!", "error");
      return;
    }

    // Disable submit button to avoid double-click
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const res = await fetch(`/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updatedTitle,
          completed: updatedStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      form.classList.add("hidden");
      await getTodos();
      showMessage("To-Do Updated Successfully", "info");
    } catch (err) {
      console.error("Update failed:", err);
      showMessage("Failed to update todo", "error");
    } finally {
      submitBtn.disabled = false;
    }
  }
});
