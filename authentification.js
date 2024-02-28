//Retrieve token from the sessionStorage
const token = sessionStorage.getItem("token");
const loginLink = document.getElementById("login-link");

//If the token exist login will transform in a logout link
export function isLogged() {
  if (token) {
    loginLink.innerText = "logout";
    loginLink.addEventListener("click", function (event) {
      event.preventDefault();
      sessionStorage.removeItem("token");
      window.location.reload();
      return true;
    });
  } else {
    loginLink.innerText = "login";
    return false;
  }
}
isLogged();
