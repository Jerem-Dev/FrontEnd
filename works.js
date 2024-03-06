import { isLogged } from "/authentification.js";
import { token } from "/authentification.js";
import { updateGalleryCurrentFilter } from "/filter.js";

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
export async function refreshWorks() {
  const works = await fetchWorks();
  return works;
}

let works = await fetchWorks();

//---------------------GALLERY -------------------//

//Update the DOM to show work gallery
export function updateWorks(works) {
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
function modalLinkAccess() {
  const portfolio = document.querySelector(".projets");
  const worksManager = document.createElement("a");
  const imgWorksManager = document.createElement("img");
  imgWorksManager.src = "assets/icons/pen-to-square-regular.svg";
  imgWorksManager.style.height = "15px";
  imgWorksManager.style.width = "15px";
  imgWorksManager.style.marginRight = "5px";
  worksManager.className = "modal-link";
  worksManager.innerText = "modifier";
  worksManager.href = "#";
  worksManager.style.marginLeft = "15px";
  portfolio.appendChild(worksManager);
  worksManager.insertAdjacentElement("afterbegin", imgWorksManager);
  listenerOpenModal();
}

//Constructor work delete manager : show latest work gallery and add possibility to delete one or several work(s)
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
      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${this.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(" Error : " + response.status);
        }

        cleanGalleries();
        await updateWorksManagerGallery();
        await updateGalleryCurrentFilter();
      } catch (error) {
        console.error("Failed to delete work: ", error);
      }
    });
  });
}
function cleanGalleries() {
  document.querySelector(".modal_container").innerHTML = "";
  document.querySelector(".gallery").innerHTML = "";
}

//---------------------WORK MANAGER ADD--------------------//
//Form constructor for adding a work
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
  submitAddButton.style.backgroundColor = "#A7A7A7";
  submitAddButton.textContent = "Valider";
  addButtonContainer.appendChild(submitAddButton);

  listenerCloseModal();
  listenerBackArrowModal();
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
        imgElement.src = event.target.result;

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
      throw new Error("Error: " + response.status);
    }
    alert("Photo envoyée avec succès !");
    resetForm();
    submitAddButton.style.backgroundColor = "#A7A7A7";
    submitAddButton.onclick = null;

    cleanGalleries();
    await updateWorksManagerGallery();
    await updateGalleryCurrentFilter();
  } catch (error) {
    console.error("Failed to add work :", error);
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

//-----------------USER AUTHENTIFICATION CHECK---------------//

//Control if user is connected
const logged = isLogged();

//Show the link to worksManager and retrieve his content if user is connected
if (logged) {
  modalLinkAccess();
  updateWorksManagerGallery();
  addWorkFormModal();
}

//--------------WORK GALLERY MANAGER OPEN/CLOSE---------------//
function listenerOpenModal() {
  const worksManager = document.querySelector(".modal-link");
  worksManager.addEventListener("click", function (event) {
    event.preventDefault();
    toggleModal(".modal", true);
  });
}

function listenerCloseModal() {
  const closeModal = document.querySelector(".modal_close");
  closeModal.addEventListener("click", function (event) {
    event.preventDefault();
    toggleModal(".modal", false);
    toggleModal(".modal-add", false);
  });
}

function toggleModal(modalSelected, show) {
  const modal = document.querySelector(modalSelected);
  modal.style.visibility = show ? "visible" : "hidden";
  modal.style.opacity = show ? "1" : "0";
}

function listerButtonAddWork() {
  const buttonAddWork = document.getElementById("add-work");
  buttonAddWork.addEventListener("click", function (event) {
    event.preventDefault();
    resetForm();
    toggleModal(".modal", false);
    toggleModal(".modal-add", true);
  });
}

function listenerBackArrowModal() {
  const backToWorkManager = document.querySelector(".modal-return");
  backToWorkManager.addEventListener("click", function (event) {
    event.preventDefault();
    resetForm();
    toggleModal(".modal", true);
    toggleModal(".modal-add", false);
  });
}
