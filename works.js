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

//Function for refreshing gallery automatically when user delete one item
async function refreshWorks() {
  const works = await fetchWorks();
  return works;
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

//---------------------WORK MANAGER DELETE---------------------------//

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

//WORK MANAGER CONSTRUCTOR : Show gallery and add possibility to delete one or several work
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

  const linkContainer = document.createElement("div");
  linkContainer.className = "modal-button-container";
  modalContainer.appendChild(linkContainer);

  const linkAddWork = document.createElement("button");
  linkAddWork.textContent = "Ajouter une photo";
  linkAddWork.className = "modal-button";
  linkAddWork.id = "add-work";
  linkContainer.appendChild(linkAddWork);

  const modalGalleryContent = document.querySelector(".modal_gallery");
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
    modalGalleryContent.appendChild(divImgContent);
    divImgContent.appendChild(imgModal);
    divImgContent.appendChild(trashImgModal);
  });
  listenerDeleteWork();
  listenerCloseModal();
  listerButtonAddWork();
}
//Listen to what items should be delete on user clic and refresh galleries after deleting an item
function listenerDeleteWork() {
  const trashIcons = document.querySelectorAll(".modal_trash");
  trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", async function () {
      await fetch(`http://localhost:5678/api/works/${this.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      document.querySelector(".modal_container").innerHTML = "";
      document.querySelector(".gallery").innerHTML = "";
      await updateWorksManagerGallery();
      await updateGalleryCurrentFilter();
    });
  });
}

//---------------------WORK MANAGER ADD--------------------//
function addWorkFormModal() {
  const workAddManager = document.querySelector(".modal-add-container");
  workAddManager.innerHTML = ` 
  <a href="#" class="modal_close">&times;</a>
  <a href="#" class="modal-return">&larr;</a>
  `;

  const addForm = document.createElement("div");
  addForm.className = "add-work-form";
  workAddManager.appendChild(addForm);

  const modalFormContainer = document.createElement("div");
  modalFormContainer.className = "add-form";
  modalFormContainer.innerHTML = `
  <form id="add-photo-form" enctype="multipart/form-data">
  <p class="modal_title">Ajout photo</p>
  <div id="image-upload-container">
  <div id="image-preview"></div>
  <div class="image-upload-content">
  <img src="assets/icons/image-regular.svg" />
  <span>+ Ajouter une image</span>
  <p>jpg, png: max 4mo</p>
  </div>
  <input type="file" id="photo" name="photo" accept=".png, .jpg" required>
</div>

  <div>
      <label for="title">Titre:</label>
      <input type="text" id="title" name="title" required>
  </div>
  <div>
      <label for="category">Categorie :</label>
      <select id="category" name="category" required>
          <option style="display:none" disabled selected value></option>
          <option value="1">Objets</option>
          <option value="2">Appartements</option>
          <option value="3">Hôtels & restaurants</option>
      </select>
  </div>
</form>`;
  workAddManager.appendChild(modalFormContainer);
  const addButtonContainer = document.createElement("div");
  addButtonContainer.classList = "modal-button-container";
  workAddManager.appendChild(addButtonContainer);

  const submitAddButton = document.createElement("button");
  submitAddButton.className = "modal-button";
  submitAddButton.id = "submit-work";
  // submitAddButton.onclick = addPhoto;
  submitAddButton.style.backgroundColor = "#A7A7A7";
  submitAddButton.textContent = "Valider";
  addButtonContainer.appendChild(submitAddButton);

  listenerCloseAddWorkModal();
  formListener();
  listenerPhotoUpload();
}

function resetForm() {
  const form = document.getElementById("add-photo-form");
  const imgForm = document.getElementById("image-preview");
  const containerContent = document.querySelector(".image-upload-content");
  form.reset();
  imgForm.innerHTML = "";
  containerContent.style.visibility = "visible";
}

function listenerPhotoUpload() {
  document
    .getElementById("image-upload-container")
    .addEventListener("click", function () {
      document.getElementById("photo").click();
    });

  document.getElementById("photo").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imgElement = document.createElement("img");
        imgElement.src = event.target.result; // Définit la source de l'img avec l'URL de l'image lue

        const previewContainer = document.getElementById("image-preview");
        previewContainer.innerHTML = "";
        previewContainer.appendChild(imgElement);
        const containerContent = document.querySelector(
          ".image-upload-content"
        );
        containerContent.style.visibility = "hidden";
      };
      reader.readAsDataURL(file);
    }
  });
}

async function addPhoto() {
  const submitAddButton = document.getElementById("submit-work");
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const photo = document.getElementById("photo").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", photo);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Erreur du serveur : " + response.status);
    }
    alert("Photo envoyée avec succès !");
    resetForm();
    submitAddButton.style.backgroundColor = "#A7A7A7";
    submitAddButton.onclick = null;

    document.querySelector(".modal_container").innerHTML = "";
    document.querySelector(".gallery").innerHTML = "";
    await updateWorksManagerGallery();
    await updateGalleryCurrentFilter();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function checkForm() {
  const submitAddButton = document.getElementById("submit-work");
  const checkTitle = document.getElementById("title").value;
  const checkCategory = document.getElementById("category").value;
  const CheckPhoto = document.getElementById("photo").files[0];

  if (checkTitle && checkCategory && CheckPhoto) {
    submitAddButton.style.backgroundColor = "#1d6154";
    submitAddButton.onclick = addPhoto;
  } else {
    submitAddButton.style.backgroundColor = "#A7A7A7";
    submitAddButton.onclick = null;
  }
}

function formListener() {
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category");
  const photoInput = document.getElementById("photo");

  if (photoInput) {
    photoInput.addEventListener("change", checkForm);
  }
  if (titleInput) {
    titleInput.addEventListener("change", checkForm);
  }
  if (categoryInput) {
    categoryInput.addEventListener("change", checkForm);
  }
}

//-----------------USER AUTHENFICATION CHECK---------------//

//Control if user is connected (true) or not (false)
const logged = isLogged();
console.log(logged);

//Show the link to worksManager and retrieve his content only if user is connected
if (logged) {
  portfolio.appendChild(worksManager);
  worksManager.insertAdjacentElement("afterbegin", imgWorksManager);
  updateWorksManagerGallery();
  addWorkFormModal();
}
console.log(token);

//--------------WORK GALLERY DELETE OPEN/CLOSE---------------//

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

//-------------------WORK MANAGER ADD OPEN/CLOSE----------------------//

function listerButtonAddWork() {
  const buttonAddWork = document.getElementById("add-work");
  buttonAddWork.addEventListener("click", function (event) {
    event.preventDefault();
    resetForm();
    document.querySelector(".modal").style.visibility = "hidden";
    document.querySelector(".modal").style.opacity = "0";
    document.querySelector(".modal-add").style.visibility = "visible";
    document.querySelector(".modal-add").style.opacity = "1";
  });
}

const backToWorkManager = document.querySelector(".modal-return");
backToWorkManager.addEventListener("click", function (event) {
  event.preventDefault();
  resetForm();
  document.querySelector(".modal").style.visibility = "visible";
  document.querySelector(".modal").style.opacity = "1";
  document.querySelector(".modal-add").style.visibility = "hidden";
  document.querySelector(".modal-add").style.opacity = "0";
});

function listenerCloseAddWorkModal() {
  const closeModal = document.querySelector(".modal_close");
  closeModal.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector(".modal-add").style.visibility = "hidden";
    document.querySelector(".modal-add").style.opacity = "0";
  });
}
//-----------------------------WORKS FILTERS----------------------------------------//
//CategoryId definition => 1 : Objects | 2 : Appartments | 3 Hotel & restaurant
let currentFilter = "all";

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
