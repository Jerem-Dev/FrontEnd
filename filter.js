import { updateWorks } from "/works.js";
import { refreshWorks } from "/works.js";

// Update selected button
document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", function () {
    document
      .querySelectorAll(".filter")
      .forEach((filterRemove) => filterRemove.classList.remove("selected"));
    this.classList.add("selected");
  });
});

//-----------------------------WORKS FILTERS----------------------------------------//
//CategoryId definition => 1 : Objects | 2 : Appartments | 3 Hotel & restaurant
let currentFilter = "all";

//Reminder of current filter to update correctly the gallery when a work is added or deleted
export async function updateGalleryCurrentFilter() {
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
