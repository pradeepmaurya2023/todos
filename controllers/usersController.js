const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config(); // Make sure this is at the top

const JWT_SECRET = process.env.JWT_SECRET;

// User signup logic
async function signUp(req, res) {
  const { username, password } = req.body;
  if (username && password) {
    try {
      let user = new User({ username, password });
      await user.save();
      res.status(200).json({
        msg: "You have Successfully Signed Up",
      });
    } catch (err) {
      console.log("Error Signing Up : ", err);
      res.status(409).json({
        msg: "Username Already Exists, Try a different Username",
      });
    }
  } else {
    res.status(400).json({
      msg: "Username and Password cannot be Empty",
    });
  }
}

// User signin logic an generating a JWT token
async function signIn(req, res) {
  const { username, password } = req.body;
  if (username && password) {
    try {
      let user = await User.find({ username: username, password: password });
      if (user.length === 1) {
        console.log("User id : ", user[0]._id.toString());
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({
          token,
          msg: "You have Successfully Signed In",
        });
      } else {
        throw new Error("User not Found");
      }
    } catch (err) {
      console.log("Error in Signing in User : ", err);
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
