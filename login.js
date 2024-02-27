document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Connexion réussie", data);
        sessionStorage.setItem("token", data.token);
        window.location.href = "/index.html";
      } else {
        alert("Email or password is incorrect");
        throw new Error("Email or password is incorrect");
      }
    } catch (error) {
      console.error("Server doesn't respond", error);
    }
  });
