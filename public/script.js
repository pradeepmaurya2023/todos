const signup = document.getElementById("signup-form");
const signin = document.getElementById("signin-form");

// checking if token is already available in local storage redirect user to todos page
document.addEventListener("DOMContentLoaded", (e) => {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "todos.html";
  }
});
//

// --- SIGNUP FORM HANDLER ---
signup.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signup-username");
  const password = document.getElementById("signup-password");
  const signupMsg = document.getElementById("signup-msg");
  const submitBtn = signup.querySelector("button[type='submit']");

  // Input validation
  if (!username.value.trim() || !password.value.trim()) {
    signupMsg.textContent = "Username and Password cannot be empty";
    signupMsg.className = "error";
    return;
  }

  // Disable button during request
  submitBtn.disabled = true;

  try {
    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value.trim(),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      signupMsg.textContent = data.msg;
      signupMsg.classList.remove("error");
      username.value = "";
      password.value = "";
    } else {
      signupMsg.textContent = data.msg;
      signupMsg.classList.add("error");
    }
  } catch (error) {
    console.error("Signup Error:", error);
    signupMsg.textContent = "Something went wrong!";
    signupMsg.classList.add("error");
  }

  // Re-enable button
  submitBtn.disabled = false;
});

// --- SIGNIN FORM HANDLER ---
signin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signin-username");
  const password = document.getElementById("signin-password");
  const signinMsg = document.getElementById("signin-msg");
  const submitBtn = signin.querySelector("button[type='submit']");

  if (!username.value.trim() || !password.value.trim()) {
    signinMsg.textContent = "Username and Password cannot be empty";
    signinMsg.className = "error";
    return;
  }

  submitBtn.disabled = true;

  try {
    const res = await fetch("/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value.trim(),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      signinMsg.textContent = data.msg;
      signinMsg.classList.remove("error");
      localStorage.setItem("token", data.token);
      username.value = "";
      password.value = "";
      window.location.href = "todos.html";
    } else {
      signinMsg.textContent = data.msg;
      signinMsg.classList.add("error");
    }
  } catch (error) {
    console.error("Signin Error:", error);
    signinMsg.textContent = "Something went wrong!";
    signinMsg.classList.add("error");
  }

  submitBtn.disabled = false;
});
