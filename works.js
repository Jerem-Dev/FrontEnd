import { isLogged } from "/authentification.js";
import { token } from "/authentification.js";

//Get all the works stored in the API and transform the data in JSON
async function fetchWorks() {
  let works = {};
  try {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
    return works;
  } catch (error) {
    console.error("Failed to fetch data from API", error);
  }
}
let works = await fetchWorks();

console.table(works);

//---------------------GALLERY -------------------//

//Update the DOM by creating a <figure> for each works
function updateWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const imgFigure = document.createElement("img");
    const imgFigcaption = document.createElement("figcaption");
    imgFigure.src = work.imageUrl;
    imgFigure.alt = work.title;
    imgFigcaption.textContent = work.title;
    gallery.appendChild(figure);
    figure.appendChild(imgFigure);
    figure.appendChild(imgFigcaption);
  });
}

updateWorks(works);

// ----------------------------------------------- //

//Function to refresh gallery automatically when user delete one item
async function refreshWorks() {
  const works = await fetchWorks();
  return works;
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
async function updateWorksManagerGallery() {
  const upToDateWorks = await refreshWorks();
  const modalContainer = document.querySelector(".modal_container");
  const modalGallery = document.createElement("div");
  modalGallery.className = "modal_gallery";
  modalContainer.innerHTML = `
  <a href="#" class="modal_close">&times;</a>
  <p class= "modal_title">Galerie photo</p>
  `;
  modalContainer.appendChild(modalGallery);
  const modalContent = document.querySelector(".modal_gallery");
  upToDateWorks.forEach((work) => {
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
    trashIcon.addEventListener("click", async function () {
      fetch(`http://localhost:5678/api/works/${this.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      document.querySelector(".modal_container").innerHTML = "";
      document.querySelector(".gallery").innerHTML = "";
      const updatedWorks = await refreshWorks();
      updateWorksManagerGallery(updatedWorks);
      updateGalleryCurrentFilter();
    });
  });
}

//Show the link to worksManager and retrieve his content only if user is connected
if (logged) {
  portfolio.appendChild(worksManager);
  worksManager.insertAdjacentElement("afterbegin", imgWorksManager);
  updateWorksManagerGallery(works);
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

//-----------------------------FILTER SECTION----------------------------------------//
let currentFilter = null;

//Reminder of current filter to update correctly the gallery when a work is added or deleted
async function updateGalleryCurrentFilter() {
  const upToDateWorks = await refreshWorks();
  switch (currentFilter) {
    case "all":
      updateWorks(upToDateWorks);
      break;
    case "objects":
      const objectsWorks = upToDateWorks.filter(
        (work) => work.categoryId === 1
      );
      updateWorks(objectsWorks);
      break;
    case "appartment":
      const appartmentWorks = upToDateWorks.filter(
        (work) => work.categoryId === 2
      );
      updateWorks(appartmentWorks);
      break;
    case "hotel-restaurant":
      const hotelRestaurantWorks = upToDateWorks.filter(
        (work) => work.categoryId === 3
      );
      updateWorks(hotelRestaurantWorks);
      break;
  }
}

//CategoryId definition => 1 : Objects | 2 : Appartments | 3 Hotel & restaurant
// Show all works
const allFilter = document.querySelector("#all");
allFilter.addEventListener("click", async function () {
  currentFilter = "all";
  const upToDateWorks = await refreshWorks();
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(upToDateWorks);
});

// Sort works to show objects
const objectsFilter = document.querySelector("#objects");
objectsFilter.addEventListener("click", async function () {
  currentFilter = "objects";
  const upToDateWorks = await refreshWorks();
  const objectsWorks = upToDateWorks.filter((work) => work.categoryId === 1);
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(objectsWorks);
});

//Sort works to show appartments
const appartmentFilter = document.querySelector("#appartment");
appartmentFilter.addEventListener("click", async function () {
  currentFilter = "appartment";
  const upToDateWorks = await refreshWorks();
  const appartmentWorks = upToDateWorks.filter((work) => work.categoryId === 2);
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(appartmentWorks);
});

//Sort works to show hotels and restaurants
const hotelRestaurantFilter = document.querySelector("#hotel-restaurant");
hotelRestaurantFilter.addEventListener("click", async function () {
  currentFilter = "hotel-restaurant";
  const upToDateWorks = await refreshWorks();
  const hotelRestaurantWorks = upToDateWorks.filter(
    (work) => work.categoryId === 3
  );
  document.querySelector(".gallery").innerHTML = "";
  updateWorks(hotelRestaurantWorks);
});
