import { isLogged } from "/authentification.js";
import { works, fetchWorks, updateWorks } from "/works.js";
import { token } from "/authentification.js";

//Function to refresh gallery automatically when user delete one item
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

//Show gallery and add possibility to delete one or several work
function updateWorksManagerGallery(works) {
  const modalContainer = document.querySelector(".modal_container");
  const modalGallery = document.createElement("div");
  modalGallery.className = "modal_gallery";
  modalContainer.innerHTML = `
  <a href="#" class="modal_close">&times;</a>
  <p class= "modal_title">Galerie photo</p>
  `;
  modalContainer.appendChild(modalGallery);
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
  listenerDeleteWork();
  listenerCloseModal();
}
//Listen to what items should be delete on user clic
function listenerDeleteWork() {
  const trashIcons = document.querySelectorAll(".modal_trash");
  trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", function () {
      fetch(`http://localhost:5678/api/works/${this.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      document.querySelector(".modal_container").innerHTML = "";
      document.querySelector(".gallery").innerHTML = "";
      refreshWorks();
    });
  });
}

//Show the link to worksManager and retrieve his content only if user is connected
if (logged) {
  portfolio.appendChild(worksManager);
  worksManager.insertAdjacentElement("afterbegin", imgWorksManager);
  updateWorksManagerGallery(works);
  listenerCloseModal();
}

//Events for open or close modal window
worksManager.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".modal").style.visibility = "visible";
  document.querySelector(".modal").style.opacity = "1";
});

function listenerCloseModal() {
  const closeModal = document.querySelector(".modal_close");
  closeModal.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector(".modal").style.visibility = "hidden";
    document.querySelector(".modal").style.opacity = "0";
  });
}
