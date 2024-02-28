//Login logic , retrieve data from user (email, password) and compare it with data from the API
//If email and password exist and are correct , user will be connected.Else an error will be shown
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
        //Store the connexion token , token will be erased automatically when user close web browser
        sessionStorage.setItem("token", data.token);
        window.location.href = "/index.html";
      } else {
        alert("Email or password is incorrect");
        throw new Error("Email or password is incorrect");
      }
    } catch (error) {
      console.error("Server doesn't respond", error); //Throw an error when communication with server is not possible
    }
  });
