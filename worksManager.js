import { isLogged } from "/authentification.js";
import { works } from "/works.js";

//Control if user is connected (true) or not (false)
const logged = isLogged();
console.log(logged);

//Create the "modifier" link
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

//Show the link to worksManager only if user is connected
if (logged) {
  portfolio.appendChild(worksManager);
  worksManager.insertAdjacentElement("afterbegin", imgWorksManager);
} else {
  portfolio.removeChild(worksManager);
}

//Events for open or close modal window
const closeModal = document.querySelector(".modal_close");
worksManager.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".modal").style.visibility = "visible";
  document.querySelector(".modal").style.opacity = "1";
});

closeModal.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".modal").style.visibility = "hidden";
  document.querySelector(".modal").style.opacity = "0";
});

function updateWorksManagerGallery(works) {
  const modalContent = document.querySelector(".modal_gallery");
  works.forEach((work) => {
    const divImgContent = document.createElement("div");
    const imgModal = document.createElement("img");
    const trashImgModal = document.createElement("img");
    divImgContent.className = "content_img";
    imgModal.src = work.imageUrl;
    imgModal.alt = work.title;
    imgModal.className = "img-works-manager";
    trashImgModal.src = "assets/icons/trash-can-regular.svg";
    trashImgModal.className = "modal_trash";
    modalContent.appendChild(divImgContent);
    divImgContent.appendChild(imgModal);
    divImgContent.appendChild(trashImgModal);
  });
}

updateWorksManagerGallery(works);

const trashImg = document.querySelector(".modal_trash");
trashImg.addEventListener("click", function () {});
