import { isLogged } from "/authentification.js";
import { works, fetchWorks, updateWorks } from "/works.js";
import { token } from "/authentification.js";

async function refreshWorks() {
  const works = await fetchWorks();
  updateWorks(works);
  updateWorksManagerGallery(works);
}

console.log(token);

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
    trashImgModal.id = work.id;
    modalContent.appendChild(divImgContent);
    divImgContent.appendChild(imgModal);
    divImgContent.appendChild(trashImgModal);
  });
}

//Show the link to worksManager and retrieve his content only if user is connected
if (logged) {
  portfolio.appendChild(worksManager);
  worksManager.insertAdjacentElement("afterbegin", imgWorksManager);
  updateWorksManagerGallery(works);
}

const trashIcons = document.querySelectorAll(".modal_trash");
trashIcons.forEach((trashIcon) => {
  trashIcon.addEventListener("click", function () {
    fetch(`http://localhost:5678/api/works/${this.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    document.querySelector(".modal_gallery").innerHTML = "";
    document.querySelector(".gallery").innerHTML = "";
    refreshWorks();
  });
});
