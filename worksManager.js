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
