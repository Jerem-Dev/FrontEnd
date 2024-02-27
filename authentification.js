const token = sessionStorage.getItem("token");
const loginLink = document.getElementById("login-link");

if (token) {
  loginLink.innerText = "logout";
  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.reload();
  });
} else {
  loginLink.innerText = "login";
}
