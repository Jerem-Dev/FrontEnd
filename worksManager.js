import { isLogged } from "/authentification.js";

const logged = isLogged();
console.log(logged);

const portfolio = document.querySelector(".projets");
const worksManager = document.createElement("a");
const imgWorksManager = document.createElement("img");
imgWorksManager.src = "assets/icons/pen-to-square-regular.svg";
imgWorksManager.style.height = "15px";
imgWorksManager.style.width = "15px";
imgWorksManager.style.marginRight = "5px";
worksManager.innerText = "modifier";
worksManager.href = "#";
worksManager.style.marginLeft = "15px";

if (logged) {
  portfolio.appendChild(worksManager);
  worksManager.insertAdjacentElement("afterbegin", imgWorksManager);
} else {
  portfolio.removeChild(worksManager);
}

worksManager.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".modal").style.visibility = "visible";
  document.querySelector(".modal").style.opacity = "1";
});

const closeModal = document.querySelector(".modal_close");

closeModal.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".modal").style.visibility = "hidden";
  document.querySelector(".modal").style.opacity = "0";
});
