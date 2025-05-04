const express = require("express");
const { signUp, signIn } = require("./controllers/usersController");
require("dotenv").config(); // Make sure this is at the top

// todos routes
const todosRoutes = require("./routes/todos");
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

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
app.post("/signup", signUp);

// Sign in route
app.post("/signin", signIn);

// Protected route test
// app.get("/protected", auth, (req, res) => {
//   const user = req.user;
//   res.json({
//     msg: `Hello ${user.username}`,
//   });
// });

// Staring DB Connection and Server
connectDB();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
